<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'email' => 'admin@admin.com',
            'name' => 'Admin',
            'password' => 'admin123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $dataEntry = User::create([
            'email' => 'dataentry@dataentry.com',
            'name' => 'Data Entry',
            'password' => 'data123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $dataEntry->assignRole('data_entry');

        $doctor = User::create([
            'email' => 'doctor@doctor.com',
            'name' => 'Doctor',
            'password' => 'doctor123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $doctor->assignRole('doctor');
    }
}
