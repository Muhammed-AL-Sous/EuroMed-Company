<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Seeder;

class HospitalSeeder extends Seeder
{
    public function run(): void
    {
        $hospitals = [
            [
                'name' => 'Rizgary Hospital',
                'city' => 'Erbil',
                'type' => 'Government',
            ],
            [
                'name' => 'Par Hospital',
                'city' => 'Sulaymaniyah',
                'type' => 'Private',
            ],
            [
                'name' => 'Rozhawa Hospital',
                'city' => 'Erbil',
                'type' => 'Government',
            ],
        ];

        foreach ($hospitals as $hospital) {
            Hospital::create($hospital);
        }
    }
}
