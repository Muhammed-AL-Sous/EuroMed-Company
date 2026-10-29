<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ManufacturerSeeder extends Seeder
{

    public function run(): void
    {
        $path = database_path(
            'seeders/data/manufacturers.json'
        );

        $manufacturers = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($manufacturers as $manufacturer) {
            Manufacturer::updateOrCreate(
                ['code' => $manufacturer['code']],
                [
                    'name' => $manufacturer['name'],
                    'origin' => $manufacturer['origin'],
                    'logo_text' => $manufacturer['logo_text'],
                    'description' => $manufacturer['description'],
                    'website' => $manufacturer['website'],
                    'is_active' => $manufacturer['is_active'],
                ]
            );
        }
    }
}
