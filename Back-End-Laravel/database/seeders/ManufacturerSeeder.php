<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManufacturerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Manufacturers = [
            ['name' => 'Maxx Medical Company', 'country' => 'USA'],
            ['name' => 'Marapole Medical Company', 'country' => 'China'],
            ['name' => 'Medtronic', 'country' => 'Ireland'],
            ['name' => 'Johnson & Johnson', 'country' => 'USA'],
            ['name' => 'Siemens Healthineers', 'country' => 'Germany'],
            ['name' => 'GE Healthcare', 'country' => 'USA'],
            ['name' => 'Philips Healthcare', 'country' => 'Netherlands'],
            ['name' => 'Abbott Laboratories', 'country' => 'USA'],
            ['name' => 'Baxter International', 'country' => 'USA']
        ];

        foreach ($Manufacturers as $Manufacturer) {
            Manufacturer::create($Manufacturer);
        }
    }
}
