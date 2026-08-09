<?php

namespace App\Services\Auth;

use App\Http\Resources\UserResource;
use App\Mail\SendVerificationCode;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\HasFastCheckCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class EmailVerificationService
{
    use ApiResponse;
    use HasFastCheckCookie;

    public function verifyCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (! $user) {
            return self::notFound('User Not Found.');
        }

        if ($user->email_verified_at) {
            return self::error('Email Already Verified.', 400);
        }

        if ($user->expires_at?->isPast()) {
            return self::error('Verification Code Expired. Please Request a New One.', 400);
        }

        if (! Hash::check($validated['code'], $user->email_verification_code)) {
            RateLimiter::hit($this->verifyThrottleKey($request), 60);

            return self::unauthorized('Invalid Verification Code.');
        }

        RateLimiter::clear($this->verifyThrottleKey($request));

        $user->forceFill([
            'email_verified_at' => now(),
            'is_active' => true,
            'email_verification_code' => null,
            'expires_at' => null,
        ])->save();

        Auth::login($user);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return self::success(
            ['user' => new UserResource($user->load(['roles', 'doctor']))],
            'Email Verified Successfully.'
        )->withCookie($this->getFastCheckCookie());
    }

    public function resendCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        if ($response = $this->checkResendRateLimit($request)) {
            return $response;
        }

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (! $user) {
            return self::notFound('User Not Found.');
        }

        if ($user->email_verified_at) {
            return self::error('Email Already Verified.', 400);
        }

        if ($user->next_resend_available_at?->isFuture()) {
            $retryAfter = now()->diffInSeconds($user->next_resend_available_at);

            return self::tooManyRequests(
                "Please Wait {$retryAfter} Seconds Before Requesting a New Code."
            );
        }

        $verificationCode = random_int(100000, 999999);

        $user->forceFill([
            'email_verification_code' => Hash::make((string) $verificationCode),
            'expires_at' => now()->addMinutes(10),
            'next_resend_available_at' => now()->addMinutes(2),
        ])->save();

        Mail::to($user->email)->send(new SendVerificationCode($user, $verificationCode));

        return self::success(
            ['retry_after' => 120],
            'Verification Code Sent.'
        );
    }

    private function checkResendRateLimit(Request $request): ?JsonResponse
    {
        $key = 'resend-code:' . strtolower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            return self::tooManyRequests(
                "Too Many Resend Attempts. Please Try Again in {$seconds} Seconds."
            );
        }

        RateLimiter::hit($key, 120);

        return null;
    }

    private function verifyThrottleKey(Request $request): string
    {
        return 'verify-email:' . strtolower($request->input('email')) . '|' . $request->ip();
    }
}
