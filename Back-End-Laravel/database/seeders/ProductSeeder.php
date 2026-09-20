<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'code' => 'MTUUX100-K',
                'name' => 'Tibial Base 1 Metalbacked',
                'description' => 'Description for Tibial Base 1 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 1 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX200-K',
                'name' => 'Tibial Base 2 Metalbacked',
                'description' => 'Description for Tibial Base 2 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 2 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX300-K',
                'name' => 'Tibial Base 3 Metalbacked',
                'description' => 'Description for Tibial Base 3 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 3 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX400-K',
                'name' => 'Tibial Base 4 Metalbacked',
                'description' => 'Description for Tibial Base 4 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 4 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX500-K',
                'name' => 'Tibial Base 5 Metalbacked',
                'description' => 'Description for Tibial Base 5 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 5 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX600-K',
                'name' => 'Tibial Base 6 Metalbacked',
                'description' => 'Description for Tibial Base 6 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 6 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX700-K',
                'name' => 'Tibial Base 7 Metalbacked',
                'description' => 'Description for Tibial Base 7 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 7 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MTUUX800-K',
                'name' => 'Tibial Base 8 Metalbacked',
                'description' => 'Description for Tibial Base 8 Metalbacked',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical Usage Information For Tibial Base 8 Metalbacked',
                'specifications' => [
                    'Material' => 'CoCr Alloy (Cobalt Chrome)',
                    'Fixation' => 'Cemented / Porous Coated',
                    'Sizes' => 'Size 1 to Size 8 (Left/Right)',
                    'Flexion Range' => 'Up to 155°'
                ],
                'available_sizes' => ['1', '2', '3', '4', '5', '6', '7', '8'],
            ],

            [
                'code' => 'MO-MSEC-40/MA',
                'name' => 'Cementless Modular Shell 40mm',
                'description' => 'Description for Cementless Modular Shell 40mm',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 1,
                'price' => 550,
                'image_url' => 'products/MO-MSEC-40-MA.jpg',
            ],

            [
                'code' => 'MO-MSEC-42/MA',
                'name' => 'Cementless Modular Shell 42mm',
                'description' => 'Description for Cementless Modular Shell 42mm',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 1,
                'price' => 550,
                'image_url' => 'products/MO-MSEC-42-MA.jpg',
            ],

            [
                'code' => 'MO-MSEC-44/MB',
                'name' => 'Cementless Modular Shell 44mm',
                'description' => 'Description for Cementless Modular Shell 44mm',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 1,
                'price' => 550,
                'image_url' => 'products/MO-MSEC-44-MB.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
