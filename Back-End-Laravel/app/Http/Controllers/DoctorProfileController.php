<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDoctorProfileRequest;
use App\Http\Requests\UpdateDoctorProfileRequest;
use App\Http\Resources\DoctorResource;
use App\Services\DoctorService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorProfileController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $doctor = $request->user()->doctor;

        return $this->success([
            'has_profile' => $doctor !== null,
            'profile' => $doctor
                ? new DoctorResource($doctor)
                : null,
        ]);
    }

    public function store(
        StoreDoctorProfileRequest $request
    ): JsonResponse {
        $user = $request->user();

        if ($user->doctor()->exists()) {
            return $this->error(
                'Doctor Profile Already Exists. Use Update Instead.',
                409
            );
        }

        $doctor = $this->doctorService->createForUser(
            $user,
            $request->validated()
        );

        return $this->created([
            'has_profile' => true,
            'profile' => new DoctorResource($doctor),
        ], 'Doctor Profile Created Successfully.');
    }

    public function update(
        UpdateDoctorProfileRequest $request
    ): JsonResponse {
        $doctor = $request->user()->doctor;

        if (! $doctor) {
            return $this->notFound(
                'Doctor Profile Not Found. Please Create Your Profile First.'
            );
        }

        $doctor = $this->doctorService->update(
            $doctor,
            $request->validated()
        );

        return $this->updated([
            'has_profile' => true,
            'profile' => new DoctorResource($doctor),
        ], 'Doctor Profile Updated Successfully.');
    }
}
