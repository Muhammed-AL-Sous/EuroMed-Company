<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Resources\UserResource;
use App\Mail\SendVerificationCode;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\HasFastCheckCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RegistrationService
{
    use ApiResponse;
    use HasFastCheckCookie;

    public function register(AuthRegisterRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $verificationCode = random_int(100000, 999999);

            $user = DB::transaction(function () use ($data, $verificationCode) {
                $user = $this->createUser($data, $verificationCode);

                $this->assignDefaultRole($user);

                return $user;
            });

            Mail::to($user->email)
                ->send(new SendVerificationCode($user, $verificationCode));

            return self::created(['user' => new UserResource($user->load('roles'))])
                ->withCookie($this->getFastCheckCookie());
        } catch (\Throwable $e) {
            Log::error('Registration failed', ['exception' => $e]);

            return self::databaseError(
                app()->isProduction()
                    ? 'Registration failed. Please try again later.'
                    : $e->getMessage()
            );
        }
    }

    private function createUser(array $data, int $verificationCode): User
    {
        $user = new User([
            'name' => $data['name'],
            'email' => strtolower(trim($data['email'])),
            'expires_at' => now()->addMinutes(10),
            'is_active' => false,
        ]);

        $user->password = Hash::make($data['password']);
        $user->email_verification_code = Hash::make((string) $verificationCode);
        $user->save();

        return $user;
    }

    private function assignDefaultRole(User $user): void
    {
        $user->assignRole(UserRole::DOCTOR->value);
    }
}
