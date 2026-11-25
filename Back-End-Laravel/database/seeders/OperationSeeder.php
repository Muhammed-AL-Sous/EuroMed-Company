<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\Patient;
use App\Models\Product;
use App\Models\Operation\Operation;
use App\Models\Operation\OperationType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OperationSeeder extends Seeder
{
    public function run(): void
    {
        $operations = json_decode(
            file_get_contents(
                database_path('seeders/data/operations.json')
            ),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        DB::transaction(function () use ($operations) {

            foreach ($operations as $data) {

                $code = $data['patient_access_code'];

                $patient = $this->resolveRecord(
                    Patient::class,
                    'import_reference',
                    $data['patient_import_reference'],
                    $code
                );

                $doctor = $this->resolveRecord(
                    Doctor::class,
                    'name',
                    $data['doctor'],
                    $code
                );

                $hospital = $this->resolveRecord(
                    Hospital::class,
                    'name',
                    $data['hospital'],
                    $code
                );

                $operationType = $this->resolveRecord(
                    OperationType::class,
                    'name',
                    $data['operation_type'],
                    $code
                );

                // Prevent conflicts with existing operations
                $conflict = Operation::where(
                    'patient_access_code',
                    $code
                )->where(function ($query) use ($data) {
                    $query->whereNull('import_reference')
                        ->orWhere(
                            'import_reference',
                            '!=',
                            $data['import_reference']
                        );
                })->exists();

                if ($conflict) {
                    throw new RuntimeException(
                        "Operation code conflict: {$code}"
                    );
                }

                // Create or update operation
                $operation = Operation::updateOrCreate(
                    [
                        'import_reference' => $data['import_reference'],
                    ],
                    [
                        'patient_access_code' => $code,
                        'operation_date' => $data['operation_date'],
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctor->id,
                        'hospital_id' => $hospital->id,
                        'operation_type_id' => $operationType->id,
                        'side' => $data['side'],
                    ]
                );

                // Create or update operation items
                foreach ($data['items'] as $item) {

                    $product = $this->resolveRecord(
                        Product::class,
                        'code',
                        (string) $item['product_code'],
                        $code
                    );

                    $operationItem = $operation->items()
                        ->withTrashed()
                        ->updateOrCreate(
                            [
                                'product_id' => $product->id,
                            ],
                            [
                                'quantity' => $item['quantity'],
                            ]
                        );

                    if ($operationItem->trashed()) {
                        $operationItem->restore();
                    }
                }
            }
        });

        $this->command->info(
            count($operations) . ' operations imported successfully.'
        );
    }
    private function resolveRecord(
        string $model,
        string $column,
        string $value,
        string $operationCode
    ) {
        $records = $model::where($column, $value)->get();

        if ($records->count() !== 1) {
            throw new RuntimeException(
                sprintf(
                    'Operation: %s | Model: %s | %s: %s | Found: %d | IDs: %s',
                    $operationCode,
                    class_basename($model),
                    $column,
                    $value,
                    $records->count(),
                    $records->pluck('id')->implode(', ')
                )
            );
        }

        return $records->first();
    }
}
