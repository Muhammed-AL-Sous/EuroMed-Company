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
