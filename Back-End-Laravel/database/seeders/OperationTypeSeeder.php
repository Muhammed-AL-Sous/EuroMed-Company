<?php

namespace Database\Seeders;

use App\Models\Operation\OperationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OperationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $OperationsTypes = [
            [
                'name' => 'Total Hip Replacement'
            ],
            [
                'name' => 'Total Knee Replacement'
            ],
            [
                'name' => 'Bipolar Replacement'
            ]
        ];

        foreach ($OperationsTypes as $OperationsType) {
            OperationType::create($OperationsType);
        }
    }
}
