<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/users.json');

        $users = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                [
                    'id' => $userData['id'],
                ],
                [
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make($userData['password']),
                    'is_active' => $userData['is_active'],
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([
                $userData['role'],
            ]);
        }
    }
}
