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
            [
                "name" => 'T Knee Replacement',
                "description" => 'Total Knee Replacement Prosthesis, Femoral & Tibial Components, and Polyethylene Inserts.',
            ],
            [
                "name" => 'T Hip Replacement',
                "description" => 'Total Hip Replacement Stems, Acetabular Cups, Ceramic & Metallic Heads, Liners.',
            ],
            [
                "name" => 'Bipolar',
                "description" => 'Bipolar Hip Prosthesis Systems For Hemi-Arthroplasty Procedures.',
            ],
            [
                "name" => 'Plate & Screw',
                "description" => 'Anatomical Locking Compression Plates, Cortical & Cancellous Bone Fixation Screws.',
            ],
            [
                "name" => 'Herbert Screw',
                "description" => 'Headless Compression Herbert Screws For Osteochondral Fractures & Nonunions.',
            ],
            [
                "name" => 'Tibial Nail',
                "description" => 'Intramedullary Tibial Interlocking Nails.',
            ],
            [
                "name" => 'Femoral Nail',
                "description" => 'Intramedullary Femoral Interlocking Nails.',
            ],
            [
                "name" => 'Other Products',
                "description" => 'Bone Cement, Surgical Power Tools, Pulse Lavage, and Specialized Orthopedic Instruments.',
            ],
        ];

        foreach ($subCategories as $subCategory) {
            SubCategory::create($subCategory);
        }
    }
}
