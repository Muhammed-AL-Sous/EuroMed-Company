<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $retryAfter = 0;

        if (
            $this->next_resend_available_at &&
            $this->next_resend_available_at->isFuture()
        ) {
            $retryAfter = now()->diffInSeconds(
                $this->next_resend_available_at
            );
        }

        $role = $this->relationLoaded('roles')
            ? $this->roles->first()
            : null;

        $doctor = $this->relationLoaded('doctor')
            ? $this->doctor
            : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,

            'created_at' => $this->created_at
                ?->format('Y-m-d H:i:s'),

            'is_active' => $this->is_active,
            'retry_after' => $retryAfter,

            'role' => [
                'role_id' => $role?->id,
                'role_name' => $role?->name,
            ],

            'doctor_profile' => $this->when(
                $role?->name === 'doctor' &&
                $this->relationLoaded('doctor'),

                fn () => [
                    'has_profile' => $doctor !== null,

                    'profile' => $doctor
                        ? new DoctorResource($doctor)
                        : null,

                    'profile_completed_at' => $doctor
                        ?->profile_completed_at
                        ?->format('Y-m-d H:i:s'),
                ]
            ),
        ];
    }
}
