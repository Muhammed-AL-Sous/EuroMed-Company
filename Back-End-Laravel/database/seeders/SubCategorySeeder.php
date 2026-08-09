<?php

namespace Database\Seeders;

use App\Models\SubCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subCategories = [
            ["name" => 'Total Hip Replacement', "description" => 'A surgical procedure in which a damaged hip joint is replaced with an artificial joint.'],
            ["name" => 'Total Knee Replacement', "description" => 'A surgical procedure in which a damaged knee joint is replaced with an artificial joint.'],
            ["name" => 'Spinal Fusion', "description" => 'A surgical procedure in which two or more vertebrae are permanently joined together to eliminate motion between them.'],
            ["name" => 'Cardiac Surgery', "description" => 'A surgical procedure performed on the heart or great vessels to treat various heart conditions.'],
            ["name" => 'Neurosurgery', "description" => 'A surgical specialty that focuses on the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves.'],
            ["name" => 'Plastic Surgery', "description" => 'A surgical specialty that focuses on the reconstruction, restoration, or alteration of the human body.'],
            ["name" => 'Orthopedic Surgery', "description" => 'A surgical specialty that focuses on the diagnosis and treatment of musculoskeletal disorders, including bones, joints, ligaments, tendons, and muscles.'],
            ["name" => 'Ophthalmic Surgery', "description" => 'A surgical specialty that focuses on the diagnosis and treatment of eye disorders and diseases.'],
            ["name" => 'ENT Surgery', "description" => 'A surgical specialty that focuses on the diagnosis and treatment of disorders of the ear, nose, and throat.']
        ];

        foreach ($subCategories as $subCategory) {
            SubCategory::create($subCategory);
        }
    }
}
