<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DoctorService
{
    public function create(array $data): Doctor
    {
        return DB::transaction(function () use ($data) {
            return Doctor::create([
                ...$data,
                'profile_completed_at' => now(),
            ]);
        });
    }

    public function createForUser(User $user, array $data): Doctor
    {
        return $this->create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'specialization' => $data['specialization'],
        ]);
    }

    public function update(Doctor $doctor, array $data): Doctor
    {
        $doctor->update([
            ...$data,
            'profile_completed_at' => $doctor->profile_completed_at ?? now(),
        ]);

        return $doctor->fresh();
    }
}
