<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class HospitalSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path(
            'seeders/data/hospitals.json'
        );

        $hospitals = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($hospitals as $hospital) {
            Hospital::updateOrCreate(
                ['code' => $hospital['code']],
                [
                    'name' => $hospital['name'],
                    'city' => $hospital['city'],
                    'type' => $hospital['type'],
                ]
            );
        }
    }
}
