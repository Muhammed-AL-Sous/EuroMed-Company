<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManufacturerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Manufacturers = [
            [
                "name" => 'MAXX',
                "origin" => 'USA',
                "logo_text" => 'MAXX Orthopedics',
                "description" => 'Innovative Joint Replacement Systems Engineered for Patient Precision and Biomechanical Longevity.',
                "website" => 'https://maxxortho.com',
                "is_active" => true,
                "product_count" => 28
            ],
            [
                "name" => 'Zimmer',
                "origin" => 'USA',
                "logo_text" => 'Zimmer Biomet',
                "description" => 'Global Leader in Musculoskeletal Healthcare, Joint Reconstruction, and Trauma Technologies.',
                "website" => 'https://zimmerbiomet.com',
                "is_active" => true,
                "product_count" => 35
            ],
            [
                "name" => 'Normmed',
                "origin" => 'Turkey',
                "logo_text" => 'Normmed Medical',
                "description" => 'Turkey Precision Orthopedic Implant Manufacturer Specializing in Advanced Plate-and-Screw Systems.',
                "website" => 'https://www.normmed.com.tr/',
                "is_active" => true,
                "product_count" => 19
            ],
            [
                "name" => 'Aysam',
                "origin" => 'Turkey',
                "logo_text" => 'Aysam Ortho',
                "description" => 'High-Grade Surgical Implants and Intramedullary Nailing Systems For Complex Trauma Surgery.',
                "website" => 'https://aysam.com.tr',
                "is_active" => true,
                "product_count" => 22
            ],
            [
                "name" => 'Smith & Nephew',
                "origin" => 'UK',
                "logo_text" => 'Smith & Nephew',
                "description" => 'Worldwide Medical Technology Company Producing Sports Medicine and Joint Reconstruction Solutions.',
                "website" => 'https://smith-nephew.com',
                "is_active" => true,
                "product_count" => 18
            ],
            [
                "name" => 'Ortonommedical',
                "origin" => 'Italy',
                "logo_text" => "Ortonommedical Surgical",
                "description" => 'Specialized European manufacturer of trauma products, cerclage cables, and cannulated screw systems.',
                "website" => 'https://ortonommedical.com',
                "is_active" => true,
                "product_count" => 14
            ],
        ];

        foreach ($Manufacturers as $Manufacturer) {
            Manufacturer::create($Manufacturer);
        }
    }
}
