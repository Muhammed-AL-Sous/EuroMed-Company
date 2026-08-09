<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Patients = [
            [
                "name" => "المريض محمد ياسين بقوش",
                "phone" => "0991013483",
                "age" => "57",
                "date_of_birth" => "11-02-1969",
                "gender" => "male"
            ],
            [
                "name" => "المريض احمد الروماني",
                "phone" => "0991743483",
                "age" => "47",
                "date_of_birth" => "30-05-1979",
                "gender" => "male"
            ],
            [
                "name" => "المريضة يارا السعدي",
                "phone" => "0991013483",
                "age" => "27",
                "date_of_birth" => "05-07-1999",
                "gender" => "female"
            ]
        ];

        foreach ($Patients as $Patient) {
            Patient::create($Patient);
        }
    }
}
