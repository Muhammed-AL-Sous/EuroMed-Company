<?php

namespace Database\Seeders;

use App\Models\SubCategory;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path(
            'seeders/data/sub_categories.json'
        );

        $subcategories = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($subcategories as $subcategory) {
            SubCategory::updateOrCreate(
                ['code' => $subcategory['code']],
                [
                    'name' => $subcategory['name'],
                    'description' => $subcategory['description'],
                ]
            );
        }
    }
}
