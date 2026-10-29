<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Manufacturer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use RuntimeException;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/products.xlsx');

        if (! file_exists($path)) {
            throw new RuntimeException(
                'Products Excel file not found.'
            );
        }

        // Load Excel file
        $rows = IOFactory::load($path)
            ->getActiveSheet()
            ->toArray(null, true, false, false);

        if (empty($rows)) {
            throw new RuntimeException(
                'Products Excel file is empty.'
            );
        }

        // Extract column headers
        $headers = array_map(
            fn($value) => trim((string) $value),
            array_shift($rows)
        );

        // Validate required columns
        $required = [
            'code',
            'name',
            'manufacturer_code',
            'category_code',
            'subcategory_code',
        ];

        $missing = array_diff($required, $headers);

        if (! empty($missing)) {
            throw new RuntimeException(
                'Missing Excel columns: ' . implode(', ', $missing)
            );
        }

        DB::transaction(function () use ($rows, $headers) {

            // Load relation IDs once for better performance
            $manufacturers = Manufacturer::query()
                ->pluck('id', 'code');

            $categories = Category::query()
                ->pluck('id', 'code');

            $subcategories = SubCategory::query()
                ->pluck('id', 'code');

            foreach ($rows as $index => $values) {

                $excelRow = $index + 2;

                // Skip completely empty rows
                $hasData = collect($values)->contains(
                    fn($value) =>
                    $value !== null &&
                        trim((string) $value) !== ''
                );

                if (! $hasData) {
                    continue;
                }

                // Convert Excel row to associative array
                $row = array_combine(
                    $headers,
                    array_slice(
                        array_pad(
                            $values,
                            count($headers),
                            null
                        ),
                        0,
                        count($headers)
                    )
                );

                // Normalize values
                $getValue = fn(string $key) =>
                trim((string) ($row[$key] ?? ''));

                $code = $getValue('code');
                $name = $getValue('name');

                $manufacturerCode = $getValue('manufacturer_code');
                $categoryCode = $getValue('category_code');
                $subcategoryCode = $getValue('subcategory_code');

                // Validate required values
                if (
                    $code === '' ||
                    $name === '' ||
                    $manufacturerCode === '' ||
                    $categoryCode === '' ||
                    $subcategoryCode === ''
                ) {
                    throw new RuntimeException(
                        "Missing required data at Excel row {$excelRow}"
                    );
                }

                // Resolve Manufacturer ID
                $manufacturerId = $manufacturers->get(
                    $manufacturerCode
                );

                if ($manufacturerId === null) {
                    throw new RuntimeException(
                        "Manufacturer '{$manufacturerCode}' not found at row {$excelRow}"
                    );
                }

                // Resolve Category ID
                $categoryId = $categories->get(
                    $categoryCode
                );

                if ($categoryId === null) {
                    throw new RuntimeException(
                        "Category '{$categoryCode}' not found at row {$excelRow}"
                    );
                }

                // Resolve Subcategory ID independently
                $subcategoryId = $subcategories->get(
                    $subcategoryCode
                );

                if ($subcategoryId === null) {
                    throw new RuntimeException(
                        "Subcategory '{$subcategoryCode}' not found at row {$excelRow}"
                    );
                }

                // Validate price
                $price = $getValue('price');

                if ($price !== '' && ! is_numeric($price)) {
                    throw new RuntimeException(
                        "Invalid price at Excel row {$excelRow}"
                    );
                }

                // Create or update product
                Product::updateOrCreate(
                    [
                        'code' => $code,
                    ],
                    [
                        'name' => $name,
                        'description' => $getValue('description') ?: null,
                        'manufacturer_id' => $manufacturerId,
                        'category_id' => $categoryId,
                        'subcategory_id' => $subcategoryId,
                        'price' => $price !== '' ? $price : null,
                        'image_url' => $getValue('image_url') ?: null,
                    ]
                );
            }
        });

        $this->command->info(
            'Products imported successfully.'
        );
    }
}
