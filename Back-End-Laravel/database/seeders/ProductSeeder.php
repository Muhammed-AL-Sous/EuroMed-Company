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
                'name' => 'TIBIAL BASE 1 METALBACKED',
                'description' => 'Description for TIBIAL BASE 1 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
                'medical_usage' => 'Medical usage information for TIBIAL BASE 1 METALBACKED',
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
                'name' => 'TIBIAL BASE 2 METALBACKED',
                'description' => 'Description for TIBIAL BASE 2 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX300-K',
                'name' => 'TIBIAL BASE 3 METALBACKED',
                'description' => 'Description for TIBIAL BASE 3 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX400-K',
                'name' => 'TIBIAL BASE 4 METALBACKED',
                'description' => 'Description for TIBIAL BASE 4 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX500-K',
                'name' => 'TIBIAL BASE 5 METALBACKED',
                'description' => 'Description for TIBIAL BASE 5 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX600-K',
                'name' => 'TIBIAL BASE 6 METALBACKED',
                'description' => 'Description for TIBIAL BASE 6 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX700-K',
                'name' => 'TIBIAL BASE 7 METALBACKED',
                'description' => 'Description for TIBIAL BASE 7 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
            ],

            [
                'code' => 'MTUUX800-K',
                'name' => 'TIBIAL BASE 8 METALBACKED',
                'description' => 'Description for TIBIAL BASE 8 METALBACKED',
                'manufacturer_id' => 1,
                'category_id' => 1,
                'subcategory_id' => 2,
                'price' => 500,
                'image_url' => 'products/tibial_base.png',
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
