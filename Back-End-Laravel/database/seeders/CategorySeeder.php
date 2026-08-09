<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                "name" => "Arthroplasty Surgery",
                "description" => "A surgical specialty that focuses on the diagnosis and treatment of musculoskeletal disorders, including bones, joints, ligaments, tendons, and muscles."
            ],
            [
                "name" => "Trauma Surgery",
                "description" => "A surgical procedure performed on the heart or great vessels to treat various heart conditions."
            ],
            [
                "name" => "Neurosurgery",
                "description" => "A surgical specialty that focuses on the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves."
            ],
            [
                "name" => "Plastic Surgery",
                "description" => "A surgical specialty that focuses on the reconstruction, restoration, or alteration of the human body."
            ],
            [
                "name" => "Ophthalmic Surgery",
                "description" => "A surgical specialty that focuses on the diagnosis and treatment of eye disorders and diseases."
            ],
            [
                "name" => "ENT Surgery",
                "description" => "A surgical specialty that focuses on the diagnosis and treatment of disorders of the ear, nose, and throat."
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
