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
            'code' => 'MTUUX100-K',
            'name' => 'TIBIAL BASE 1 METALBACKED',
            'description' => 'Description for TIBIAL BASE 1 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);

        Product::create([
            'code' => 'MTUUX200-K',
            'name' => 'TIBIAL BASE 2 METALBACKED',
            'description' => 'Description for TIBIAL BASE 2 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);
        Product::create([
            'code' => 'MTUUX300-K',
            'name' => 'TIBIAL BASE 3 METALBACKED',
            'description' => 'Description for TIBIAL BASE 3 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);

        Product::create([
            'code' => 'MTUUX400-K',
            'name' => 'TIBIAL BASE 4 METALBACKED',
            'description' => 'Description for TIBIAL BASE 4 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);

        Product::create([
            'code' => 'MTUUX500-K',
            'name' => 'TIBIAL BASE 5 METALBACKED',
            'description' => 'Description for TIBIAL BASE 5 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);

        Product::create([
            'code' => 'MTUUX600-K',
            'name' => 'TIBIAL BASE 6 METALBACKED',
            'description' => 'Description for TIBIAL BASE 6 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);

        Product::create([
            'code' => 'MTUUX700-K',
            'name' => 'TIBIAL BASE 7 METALBACKED',
            'description' => 'Description for TIBIAL BASE 7 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);
        
        Product::create([
            'code' => 'MTUUX800-K',
            'name' => 'TIBIAL BASE 8 METALBACKED',
            'description' => 'Description for TIBIAL BASE 8 METALBACKED',
            'manufacturer_id' => 1,
            'category_id' => 1,
            'subcategory_id' => 2,
            'price' => 500,
        ]);
    }
}
