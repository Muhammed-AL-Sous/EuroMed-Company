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
                'name' => 'Dr.Ahmed Rawanduzy',
            ],
            [
                'name' => 'Dr.Amanj Gurdy',
            ],
            [
                'name' => 'Dr.Brwa Jaff',
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
