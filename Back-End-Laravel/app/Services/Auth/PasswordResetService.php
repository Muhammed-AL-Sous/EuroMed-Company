<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules\Password as PasswordRule;

class PasswordResetService
{
    use ApiResponse;

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        if ($response = $this->checkForgotRateLimit($request)) {
            return $response;
        }

        $status = Password::sendResetLink($validated);

        if ($status === Password::RESET_LINK_SENT) {
            return self::success(null, __($status));
        }

        return self::error(__($status), 400);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(8)->letters()->numbers(),
            ],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return self::success(null, __($status));
        }

        return self::error(__($status), 400);
    }

    private function checkForgotRateLimit(Request $request): ?JsonResponse
    {
        $key = 'forgot-password:' . strtolower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            return self::tooManyRequests(
                "Too many reset attempts. Please try again in {$seconds} seconds."
            );
        }

        RateLimiter::hit($key, 120);

        return null;
    }
}
