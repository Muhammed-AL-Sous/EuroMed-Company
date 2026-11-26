<?php

namespace App\Services\Auth;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\HasFastCheckCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class LoginService
{
    use ApiResponse;
    use HasFastCheckCookie;

    private const MAX_ATTEMPTS = 5;
    private const DECAY_SECONDS = 60;

    public function login(
        AuthLoginRequest $request
    ): JsonResponse {
        if ($response = $this->checkRateLimit($request)) {
            return $response;
        }

        $data = $request->validated();

        $credentials = [
            'username' => $data['username'],
            'password' => $data['password'],
            'is_active' => true,
        ];

        if (! Auth::guard('web')->attempt(
            $credentials,
            $request->boolean('remember')
        )) {
            RateLimiter::hit(
                $this->throttleKey($request),
                self::DECAY_SECONDS
            );

            return self::unauthorized(__('auth.failed'));
        }

        $user = Auth::guard('web')->user();

        if (! $this->canLogin($user)) {
            Auth::guard('web')->logout();

            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            RateLimiter::hit(
                $this->throttleKey($request),
                self::DECAY_SECONDS
            );

            return self::forbidden(
                'You Are Not Authorized To Login .'
            );
        }

        RateLimiter::clear(
            $this->throttleKey($request)
        );

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return self::success([
            'user' => new UserResource(
                $user->load(['roles', 'doctor'])
            ),
        ])->withCookie(
            $this->getFastCheckCookie()
        );
    }

    private function checkRateLimit(
        AuthLoginRequest $request
    ): ?JsonResponse {
        $key = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts(
            $key,
            self::MAX_ATTEMPTS
        )) {
            $seconds = RateLimiter::availableIn($key);

            return self::tooManyRequests(
                "Too many login attempts. Please try again in {$seconds} seconds."
            );
        }

        return null;
    }

    private function throttleKey(
        AuthLoginRequest $request
    ): string {
        return 'login:'
            . $request->validated('username')
            . '|'
            . $request->ip();
    }

    private function canLogin(User $user): bool
    {
        return $user->is_active
            && $user->roles()->exists();
    }
}
