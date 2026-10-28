<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path(
            'seeders/data/categories.json'
        );

        $categories = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['code' => $category['code']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                ]
            );
        }
    }
}
