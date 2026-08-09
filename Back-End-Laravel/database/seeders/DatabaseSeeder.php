<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ManufacturerSeeder::class,
            CategorySeeder::class,
            SubCategorySeeder::class,
            PatientSeeder::class,
            ProductSeeder::class,
            OperationTypeSeeder::class,
            HospitalSeeder::class,
            DoctorSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class
        ]);
    }
}
