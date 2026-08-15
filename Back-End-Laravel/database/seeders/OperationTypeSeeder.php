<?php

namespace Database\Seeders;

use App\Models\Operation\OperationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OperationTypeSeeder extends Seeder
{
    public function run(): void
    {
        $OperationsTypes = [
            [
                "name" => 'T Knee Replacement',
                "code" => 'TK',
                "description" => 'Total Knee Replacement Prosthesis, Femoral & Tibial Components, and Polyethylene Inserts.',
                "product_count" => 14
            ],
            [
                "name" => 'T Hip Replacement',
                "code" => 'TH',
                "description" => 'Total Hip Replacement Stems, Acetabular Cups, Ceramic & Metallic Heads, Liners.',
                "product_count" => 10
            ],
            [
                "name" => 'Bipolar',
                "code" => 'BP',
                "description" => 'Bipolar Hip Prosthesis Systems For Hemi-Arthroplasty Procedures.',
                "product_count" => 8
            ],
            [
                "name" => 'Plate & Screw',
                "code" => 'PS',
                "description" => 'Anatomical Locking Compression Plates, Cortical & Cancellous Bone Fixation Screws.',
                "product_count" => 30
            ],
            [
                "name" => 'Herbert Screw',
                "code" => 'HS',
                "description" => 'Headless Compression Herbert Screws For Osteochondral Fractures & Nonunions.',
                "product_count" => 6
            ],
            [
                "name" => 'Tibial Nail',
                "code" => 'TN',
                "description" => 'Intramedullary Tibial Interlocking Nails.',
                "product_count" => 40
            ],
            [
                "name" => 'Femoral Nail',
                "code" => 'FN',
                "description" => 'Intramedullary Femoral Interlocking Nails.',
                "product_count" => 50
            ],
            [
                "name" => 'Other Products',
                "code" => 'OP',
                "description" => 'Bone Cement, Surgical Power Tools, Pulse Lavage, and Specialized Orthopedic Instruments.',
                "product_count" => 9
            ],
        ];

        foreach ($OperationsTypes as $OperationsType) {
            OperationType::create($OperationsType);
        }
    }
}
