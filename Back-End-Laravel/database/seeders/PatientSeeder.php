<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $patients = json_decode(
            file_get_contents(
                database_path('seeders/data/patients.json')
            ),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        DB::transaction(function () use ($patients) {
            foreach ($patients as $patient) {
                Patient::updateOrCreate(
                    [
                        'import_reference' => $patient['import_reference'],
                    ],
                    [
                        'name' => $patient['name'],
                    ]
                );
            }
        });

        $this->command->info(
            count($patients) . ' patient records processed successfully.'
        );
    }
}
