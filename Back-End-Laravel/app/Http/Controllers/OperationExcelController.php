<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\Operation;
use App\Models\Operation\OperationType;
use App\Models\Patient;
use App\Models\Product;
use DateTimeImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;


class OperationExcelController extends Controller
{
    private const MAX_OPERATIONS = 500;
    private const MAX_ITEMS = 2000;

    /** Download a new workbook with choices sourced from current database records. */
    public function template(): StreamedResponse
    {
        $choices = $this->referenceChoices();
        $book = new Spreadsheet();

        $operations = $book->getActiveSheet();
        $operations->setTitle('Operations');
        $operations->fromArray([
            'import_reference',
            'operation_date',
            'doctor',
            'hospital',
            'operation_type',
            'patient',
            'side',
            'description',
        ], null, 'A1');

        $items = $book->createSheet();
        $items->setTitle('OperationItems');
        $items->fromArray([
            'import_reference', 'product', 'quantity',
        ], null, 'A1');

        $lists = $book->createSheet();
        $lists->setTitle('Lists');

        $definitions = [
            ['DoctorsOptions', 'doctors', 'A'],
            ['HospitalsOptions', 'hospitals', 'B'],
            ['OperationTypesOptions', 'operation_types', 'C'],
            ['PatientsOptions', 'patients', 'D'],
            ['ProductsOptions', 'products', 'E'],
            ['SidesOptions', 'sides', 'F'],
        ];

        foreach ($definitions as [$rangeName, $choiceKey, $column]) {
            $lists->setCellValue("{$column}1", $choiceKey);
            $nextRow = 2;

            foreach ($choices[$choiceKey] as $label) {
                // Explicit STRING prevents reference labels from becoming Excel formulas.
                $lists->setCellValueExplicit(
                    $column . $nextRow,
                    (string) $label,
                    DataType::TYPE_STRING
                );
                $nextRow++;
            }

            $lastRow = max(2, $nextRow - 1);
            $book->addNamedRange(new NamedRange(
                $rangeName,
                $lists,
                '$' . $column . '$2:$' . $column . '$' . $lastRow
            ));
        }

        // The value list is convenience, NOT a security boundary.
        $this->applyDropdown($operations, 'C', 'DoctorsOptions', self::MAX_OPERATIONS);
        $this->applyDropdown($operations, 'D', 'HospitalsOptions', self::MAX_OPERATIONS);
        $this->applyDropdown($operations, 'E', 'OperationTypesOptions', self::MAX_OPERATIONS);
        $this->applyDropdown($operations, 'F', 'PatientsOptions', self::MAX_OPERATIONS);
        $this->applyDropdown($operations, 'G', 'SidesOptions', self::MAX_OPERATIONS);
        $this->applyDropdown($items, 'B', 'ProductsOptions', self::MAX_ITEMS);

        $operations->getStyle('A1:H1')->getFont()->setBold(true);
        $items->getStyle('A1:C1')->getFont()->setBold(true);
        $operations->freezePane('A2');
        $items->freezePane('A2');

        foreach (['A' => 25, 'B' => 20, 'C' => 40, 'D' => 48, 'E' => 48, 'F' => 48, 'G' => 18, 'H' => 55] as $col => $width) {
            $operations->getColumnDimension($col)->setWidth($width);
        }
        foreach (['A' => 25, 'B' => 55, 'C' => 16] as $col => $width) {
            $items->getColumnDimension($col)->setWidth($width);
        }

        // Encourages YYYY-MM-DD strings rather than locale-dependent Excel dates.
        $operations->getStyle('B2:B' . (self::MAX_OPERATIONS + 1))
            ->getNumberFormat()->setFormatCode('@');

        // Do not confuse hiding a sheet with authentication or data protection.
        $lists->setSheetState(Worksheet::SHEETSTATE_HIDDEN);
        $book->setActiveSheetIndex(0);

        return response()->streamDownload(
            static function () use ($book): void {
                (new XlsxWriter($book))->save('php://output');
                $book->disconnectWorksheets();
            },
            'EuroMed_Operations_Template.xlsx',
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        );
    }

    /**
     * Import operations atomically; reject ALL rows if even one is invalid.
     * The same import_reference can never be created twice (DB UNIQUE index).
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx', 'max:10240'],
        ]);

        try {
            $reader = new XlsxReader();
            $reader->setReadDataOnly(true);
            $book = $reader->load($request->file('file')->getRealPath());
        } catch (Throwable $exception) {
            report($exception);
            return response()->json(['message' => 'Invalid or unreadable .xlsx file.'], 422);
        }

        try {
            $operationsSheet = $book->getSheetByName('Operations');
            $itemsSheet = $book->getSheetByName('OperationItems');

            if ($operationsSheet === null || $itemsSheet === null) {
                return response()->json([
                    'message' => 'The workbook must contain Operations and OperationItems sheets.',
                ], 422);
            }

            if ($operationsSheet->getHighestDataRow() > self::MAX_OPERATIONS + 1
                || $itemsSheet->getHighestDataRow() > self::MAX_ITEMS + 1) {
                return response()->json([
                    'message' => 'The file exceeds the maximum of 500 operations or 2000 item rows.',
                ], 422);
            }

            $errors = [];

            $expectedOperationsHeaders = [
                'import_reference', 'operation_date', 'doctor', 'hospital',
                'operation_type', 'patient', 'side', 'description',
            ];
            $expectedItemsHeaders = ['import_reference', 'product', 'quantity'];

            if (!$this->matchesHeader($operationsSheet, $expectedOperationsHeaders)) {
                $errors['Operations!1'][] = 'Unexpected Operations columns; download a fresh template.';
            }
            if (!$this->matchesHeader($itemsSheet, $expectedItemsHeaders)) {
                $errors['OperationItems!1'][] = 'Unexpected OperationItems columns; download a fresh template.';
            }
            if ($errors !== []) {
                return response()->json(['message' => 'Invalid Excel template.', 'errors' => $errors], 422);
            }

            $choices = $this->referenceChoices();
            $lookup = [];
            foreach (['doctors', 'hospitals', 'operation_types', 'patients', 'products'] as $name) {
                // Labels are UNIQUE because they contain the database ID.
                $lookup[$name] = array_flip($choices[$name]);
            }

            $operations = [];
            foreach ($this->sheetRows($operationsSheet, 'H') as $rowNumber => $cells) {
                $ref = trim((string) ($cells['A'] ?? ''));
                $date = $this->dateValue($cells['B'] ?? null);
                $doctor = $this->resolveChoice($cells['C'] ?? null, $lookup['doctors']);
                $hospital = $this->resolveChoice($cells['D'] ?? null, $lookup['hospitals']);
                $type = $this->resolveChoice($cells['E'] ?? null, $lookup['operation_types']);
                $patient = $this->resolveChoice($cells['F'] ?? null, $lookup['patients']);
                $side = trim((string) ($cells['G'] ?? ''));
                $description = trim((string) ($cells['H'] ?? ''));
                $where = "Operations!{$rowNumber}";

                if (!preg_match('/^[A-Za-z0-9_-]{1,100}$/D', $ref)) {
                    $errors[$where][] = 'import_reference must be 1-100 letters, digits, - or _.';
                } elseif (isset($operations[$ref])) {
                    $errors[$where][] = "Duplicate import_reference: {$ref}.";
                }

                if ($date === null) $errors[$where][] = 'Invalid date; use YYYY-MM-DD.';
                if ($doctor === null) $errors[$where][] = 'Doctor not found in current database choices.';
                if ($hospital === null) $errors[$where][] = 'Hospital not found in current database choices.';
                if ($type === null) $errors[$where][] = 'Operation type not found in current database choices.';
                if ($patient === null) $errors[$where][] = 'Patient not found in current database choices.';
                if (!in_array($side, ['', 'Left', 'Right', 'Bilateral'], true)) {
                    $errors[$where][] = 'Side must be Left, Right, Bilateral, or empty.';
                }

                if ($ref !== '' && !isset($operations[$ref])) {
                    $operations[$ref] = [
                        'operation_date' => $date,
                        'doctor_id' => $doctor,
                        'hospital_id' => $hospital,
                        'operation_type_id' => $type,
                        'patient_id' => $patient,
                        'side' => $side === '' ? null : $side,
                        'description' => $description === '' ? null : $description,
                    ];
                }
            }

            if ($operations === []) {
                $errors['Operations'][] = 'At least one operation is required.';
            }

            $itemsByReference = [];
            $seenProducts = [];
            foreach ($this->sheetRows($itemsSheet, 'C') as $rowNumber => $cells) {
                $ref = trim((string) ($cells['A'] ?? ''));
                $productId = $this->resolveChoice($cells['B'] ?? null, $lookup['products']);
                $quantity = filter_var(
                    $cells['C'] ?? null,
                    FILTER_VALIDATE_INT,
                    ['options' => ['min_range' => 1, 'max_range' => 65535]]
                );
                $where = "OperationItems!{$rowNumber}";

                if (!array_key_exists($ref, $operations)) {
                    $errors[$where][] = "Unknown import_reference: {$ref}.";
                }
                if ($productId === null) {
                    $errors[$where][] = 'Product not found in current database choices.';
                }
                if ($quantity === false) {
                    $errors[$where][] = 'Quantity must be an integer between 1 and 65535.';
                }
                if ($productId !== null) {
                    if (isset($seenProducts[$ref][$productId])) {
                        $errors[$where][] = 'This product is already listed for this operation.';
                    }
                    $seenProducts[$ref][$productId] = true;
                }

                if ($ref !== '' && $productId !== null && $quantity !== false) {
                    $itemsByReference[$ref][] = [
                        'product_id' => $productId,
                        'quantity' => $quantity,
                    ];
                }
            }

            foreach (array_keys($operations) as $ref) {
                if (empty($itemsByReference[$ref])) {
                    $errors["Operations[{$ref}]"][] = 'Every operation needs at least one item.';
                }
            }

            if ($operations !== []) {
                $existing = Operation::query()
                    ->whereIn('import_reference', array_keys($operations))
                    ->pluck('import_reference');
                foreach ($existing as $ref) {
                    $errors["Operations[{$ref}]"][] = 'This reference was already imported.';
                }
            }

            if ($errors !== []) {
                return response()->json([
                    'message' => 'Import rejected: no database records were created.',
                    'errors' => $errors,
                ], 422);
            }

            $operationCount = 0;
            $itemCount = 0;

            DB::transaction(function () use (
                $operations, $itemsByReference, &$operationCount, &$itemCount
            ): void {
                foreach ($operations as $ref => $data) {
                    $operation = Operation::create([
                        ...$data,
                        'import_reference' => $ref,
                        'patient_access_code' => Str::random(48),
                    ]);

                    foreach ($itemsByReference[$ref] as $item) {
                        $operation->items()->create($item);
                        $itemCount++;
                    }
                    $operationCount++;
                }
            }, 3);

            return response()->json([
                'message' => 'Operations imported successfully.',
                'operations_created' => $operationCount,
                'items_created' => $itemCount,
            ], 201);
        } finally {
            $book->disconnectWorksheets();
        }
    }

    /** Query the same DB labels for export and import. */
    private function referenceChoices(): array
    {
        return [
            'doctors' => Doctor::query()->orderBy('name')->get(['id', 'name'])
                ->mapWithKeys(fn ($d) => [$d->id => $this->label($d->name, $d->id)])->all(),
            'hospitals' => Hospital::query()->orderBy('name')
                ->get(['id', 'name', 'city', 'type'])
                ->mapWithKeys(fn ($h) => [
                    $h->id => $this->label(
                        $h->name . ' | ' . ($h->city ?: '-') . ' | ' . ($h->type ?: '-'),
                        $h->id
                    ),
                ])->all(),
            'operation_types' => OperationType::query()->orderBy('name')->get(['id', 'name', 'code'])
                ->mapWithKeys(fn ($t) => [
                    $t->id => $this->label($t->name . ' | ' . ($t->code ?: '-'), $t->id),
                ])->all(),
            'patients' => Patient::query()->orderBy('name')->get(['id', 'name', 'phone'])
                ->mapWithKeys(fn ($p) => [
                    $p->id => $this->label($p->name . ' | ' . ($p->phone ?: '-'), $p->id),
                ])->all(),
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'code'])
                ->mapWithKeys(fn ($p) => [
                    $p->id => $this->label($p->name . ' | ' . ($p->code ?: '-'), $p->id),
                ])->all(),
            'sides' => ['Left', 'Right', 'Bilateral'],
        ];
    }

    private function label(string $text, int $id): string
    {
        return trim($text) . " [ID:{$id}]";
    }

    private function applyDropdown(Worksheet $sheet, string $column, string $namedRange, int $max): void
    {
        for ($row = 2; $row <= $max + 1; $row++) {
            $validation = $sheet->getCell($column . $row)->getDataValidation();
            $validation->setType(DataValidation::TYPE_LIST)
                ->setErrorStyle(DataValidation::STYLE_STOP)
                ->setAllowBlank(false)
                ->setShowDropDown(true)
                ->setShowErrorMessage(true)
                ->setErrorTitle('Invalid choice')
                ->setError('Choose an entry from the dropdown list.')
                ->setFormula1($namedRange);
        }
    }

    private function matchesHeader(Worksheet $sheet, array $expected): bool
    {
        foreach ($expected as $i => $header) {
            $column = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($i + 1);
            if (trim((string) $sheet->getCell($column . '1')->getValue()) !== $header) {
                return false;
            }
        }
        return true;
    }

    /** @return array<int, array<string, mixed>> */
    private function sheetRows(Worksheet $sheet, string $lastColumn): array
    {
        $last = $sheet->getHighestDataRow();
        if ($last < 2) return [];

        $rows = $sheet->rangeToArray('A2:' . $lastColumn . $last, null, false, false, true);
        return array_filter($rows, static function (array $cells): bool {
            foreach ($cells as $cell) {
                if ($cell !== null && trim((string) $cell) !== '') return true;
            }
            return false;
        });
    }

    /** Resolve ONLY exact current labels; forged IDs or stale labels are rejected. */
    private function resolveChoice(mixed $value, array $lookup): ?int
    {
        if (!is_string($value)) return null;
        $id = $lookup[trim($value)] ?? null;
        return $id === null ? null : (int) $id;
    }

    private function dateValue(mixed $raw): ?string
    {
        if (is_int($raw) || is_float($raw) || (is_string($raw) && is_numeric($raw))) {
            try {
                return ExcelDate::excelToDateTimeObject((float) $raw)->format('Y-m-d');
            } catch (Throwable) {
                return null;
            }
        }

        if (!is_string($raw)) return null;
        $text = trim($raw);
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $text);
        return $date !== false && $date->format('Y-m-d') === $text ? $text : null;
    }
}
