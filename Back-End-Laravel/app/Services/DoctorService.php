<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DoctorService
{
    // عندما يريد الأدمن إنشاء ملف طبيب لمستخدم موجود مسبقاً في قاعدة البيانات
    public function create(array $data): Doctor
    {
        $user = User::findOrFail($data['user_id']);

        return $this->createForUser($user, [
            'name' => $data['name'],
        ]);
    }

    // إنشاء حساب مستخدم جديد وإنشاء ملفه الطبي ضمن العملية نفسها.
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
            'name' => ['required', 'string', 'max:255']
        ])->validate();

        return $this->createForUser($user, $validated);
    }


    public function delete(Doctor $doctor): void
    {
        // Check if doctor has related operations
        if ($doctor->operations()->exists()) {
            throw new ConflictHttpException(
                'Cannot Delete Doctor Because They Have Related Operations.'
            );
        }

        try {
            // Delete doctor
            $doctor->delete();
        } catch (QueryException $exception) {

            // Foreign key constraint violation
            if (in_array(
                (string) $exception->getCode(),
                ['23000', '23503'],
                true
            )) {
                throw new ConflictHttpException(
                    'Cannot Delete Doctor Because Related Records Exist.',
                    $exception
                );
            }

            throw $exception;
        }
    }
}
