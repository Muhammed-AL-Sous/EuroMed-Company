<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureDoctorProfileExists
{
    public function handle(Request $request, Closure $next): Response
    {
        $doctor = $request->user()?->doctor;

        if (! $doctor || ! $doctor->profile_completed_at) {
            return ApiResponse::forbidden(
                'Please complete your doctor profile before accessing this resource.'
            );
        }

        return $next($request);
    }
}
