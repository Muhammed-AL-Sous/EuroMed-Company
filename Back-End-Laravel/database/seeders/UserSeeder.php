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
            'email' => 'admin@euromed.com',
            'name' => 'Admin',
            'password' => 'admin123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $dataEntry = User::create([
            'email' => 'staff@euromed.com',
            'name' => 'Staff',
            'password' => 'staff123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $dataEntry->assignRole('staff');

        $doctor = User::create([
            'email' => 'doctor@euromed.com',
            'name' => 'Doctor',
            'password' => 'doctor123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $doctor->assignRole('doctor');
    }
}
