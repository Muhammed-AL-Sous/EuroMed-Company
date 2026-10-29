<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/doctors.json');

        $doctors = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($doctors as $doctorData) {
            // Ensure the user exists
            $user = User::findOrFail($doctorData['user_id']);

            // Ensure the user has the doctor role
            if (!$user->hasRole('doctor')) {
                throw new \RuntimeException(
                    "User {$user->id} does not have the doctor role."
                );
            }

            // Find existing doctor or create a new instance
            $doctor = Doctor::firstOrNew([
                'user_id' => $user->id,
            ]);

            // Update doctor information
            $doctor->name = $doctorData['name'];

            // Set completion date only if not already set
            $doctor->profile_completed_at ??= now();

            $doctor->save();
        }
    }
}
