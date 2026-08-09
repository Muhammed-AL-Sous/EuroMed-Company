<?php

namespace App\Services\Auth;

use App\Http\Requests\AuthLoginRequest;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use App\Traits\HasFastCheckCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class LoginService
{
    use ApiResponse;
    use HasFastCheckCookie;

    public function login(AuthLoginRequest $request): JsonResponse
    {
        if ($response = $this->checkRateLimit($request)) {
            return $response;
        }

        $credentials = [
            'email' => strtolower(trim($request->input('email'))),
            'password' => $request->input('password'),
        ];

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request), 60);

            return self::unauthorized(__('auth.failed'));
        }

        RateLimiter::clear($this->throttleKey($request));

        $user = Auth::user();

        if (! $this->isEmailVerified($user)) {
            Auth::logout();

            return self::forbidden('Please verify your email before logging in.');
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return self::success(['user' => new UserResource($user->load(['roles', 'doctor']))])
            ->withCookie($this->getFastCheckCookie());
    }

    private function checkRateLimit(AuthLoginRequest $request): ?JsonResponse
    {
        $key = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return self::tooManyRequests(
                "Too many login attempts. Please try again in {$seconds} seconds."
            );
        }

        return null;
    }

    private function throttleKey(AuthLoginRequest $request): string
    {
        return 'login:' . strtolower($request->input('email')) . '|' . $request->ip();
    }

    private function isEmailVerified(User $user): bool
    {
        return $user->is_active && $user->email_verified_at !== null;
    }
}
