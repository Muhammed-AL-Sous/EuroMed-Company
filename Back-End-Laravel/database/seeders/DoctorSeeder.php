<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            [
                'name' => 'Dr.Ahmed.Rawanduzy',
                'specialization' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints'
            ],
            [
                'name' => 'Dr.Amanj Gurdy',
                'specialization' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints',
            ],
            [
                'name' => 'Dr.Brwa Delshad Jaff',
                'specialization' => 'Treatment and surgery of bone fractures, osteoarthritis, sports injuries and knee injuries Replacement of pelvic and knee joints',
            ]
        ];

        foreach ($doctors as $doctor) {
            Doctor::create([
                ...$doctor,
                'profile_completed_at' => now(),
            ]);
        }
    }
}
