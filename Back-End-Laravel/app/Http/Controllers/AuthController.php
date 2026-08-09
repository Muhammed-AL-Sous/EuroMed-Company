<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\LoginService;
use App\Services\Auth\PasswordResetService;
use App\Services\Auth\RegistrationService;
use App\Traits\ApiResponse;
use App\Traits\HasFastCheckCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponse;
    use HasFastCheckCookie;

    public function __construct(
        private RegistrationService $registrationService,
        private LoginService $loginService,
        private EmailVerificationService $verificationService,
        private PasswordResetService $passwordResetService,
    ) {}

    public function register(AuthRegisterRequest $request): JsonResponse
    {
        return $this->registrationService->register($request);
    }

    public function login(AuthLoginRequest $request): JsonResponse
    {
        return $this->loginService->login($request);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        return $this->verificationService->verifyCode($request);
    }

    public function resendVerificationCode(Request $request): JsonResponse
    {
        return $this->verificationService->resendCode($request);
    }

    public function sendResetLink(Request $request): JsonResponse
    {
        return $this->passwordResetService->forgotPassword($request);
    }

    public function reset(Request $request): JsonResponse
    {
        return $this->passwordResetService->resetPassword($request);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return self::success(null, 'Logged out successfully.')
            ->withCookie($this->forgetFastCheckCookie());
    }
}
