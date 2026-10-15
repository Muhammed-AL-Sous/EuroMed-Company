<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class DoctorService
{
    public function create(array $data): Doctor
    {
        $user = User::findOrFail($data['user_id']);

        if (! $user->hasRole('doctor')) {
            throw ValidationException::withMessages([
                'user_id' => 'User Must Have Doctor Role.',
            ]);
        }

        return $this->createForUser($user, [
            'name' => $data['name'],
            'specialization' => $data['specialization'],
        ]);
    }

    public function createForUser(User $user, array $data): Doctor
    {
        if (! $user->hasRole('doctor')) {
            throw ValidationException::withMessages([
                'user_id' => 'User Must Have Doctor Role.',
            ]);
        }

        if ($user->doctor()->exists()) {
            throw ValidationException::withMessages([
                'user_id' => 'Doctor Profile Already Exists.',
            ]);
        }

        return $user->doctor()->create([
            'name' => $data['name'],
            'specialization' => $data['specialization'],
            'profile_completed_at' => now(),
        ]);
    }

    public function update(Doctor $doctor, array $data): Doctor
    {
        if (! $doctor->user?->hasRole('doctor')) {
            throw ValidationException::withMessages([
                'user_id' => 'User Must Have Doctor Role.',
            ]);
        }

        $doctor->update([
            ...$data,
            'profile_completed_at' =>
            $doctor->profile_completed_at ?? now(),
        ]);

        return $doctor->refresh();
    }

    public function saveForUser(User $user, array $data): Doctor
    {
        $doctor = $user->doctor()->first();

        // Update Existing Profile
        if ($doctor) {
            return $this->update($doctor, $data);
        }

        // Validate Complete Data Before Creating
        $validated = Validator::make($data, [
            'name' => [
                'required',
                'array:ar,en',
            ],

            'name.ar' => ['required', 'string', 'max:255'],
            'name.en' => ['required', 'string', 'max:255'],

            'specialization' => [
                'required',
                'array:ar,en',
            ],

            'specialization.ar' => ['required', 'string', 'max:255'],
            'specialization.en' => ['required', 'string', 'max:255'],
        ])->validate();

        return $this->createForUser($user, $validated);
    }
}
