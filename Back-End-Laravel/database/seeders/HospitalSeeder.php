<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Seeder;

class HospitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hospitals = [
            [
                'name' => [
                    'ar' => 'مستشفى رزكاري',
                    'en' => 'Rizgary Hospital',
                ],
                'city' => [
                    'ar' => 'أربيل',
                    'en' => 'Erbil',
                ],
                'type' => 'Government',
            ],
            [
                'name' => [
                    'ar' => 'مستشفى بار',
                    'en' => 'Par Hospital',
                ],
                'city' => [
                    'ar' => 'السليمانية',
                    'en' => 'Sulaymaniyah',
                ],
                'type' => 'Private',
            ],
            [
                'name' => [
                    'ar' => 'مستشفى دهوك',
                    'en' => 'Duhok Hospital',
                ],
                'city' => [
                    'ar' => 'دهوك',
                    'en' => 'Duhok',
                ],
                'type' => 'Government',
            ],
        ];

        foreach ($hospitals as $hospital) {
            Hospital::create($hospital);
        }
    }
}
