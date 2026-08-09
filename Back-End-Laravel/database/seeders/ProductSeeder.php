<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'code' => 'P001',
            'name' => 'Product 1',
            'description' => 'Description for Product 1',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 1,
            'price' => 100.00,
        ]);

        Product::create([
            'code' => 'P002',
            'name' => 'Product 2',
            'description' => 'Description for Product 2',
            'manufacturer_id' => 2,
            'category_id' => 2,
            'subcategory_id' => 2,
            'price' => 200.00,
        ]);
    }
}
