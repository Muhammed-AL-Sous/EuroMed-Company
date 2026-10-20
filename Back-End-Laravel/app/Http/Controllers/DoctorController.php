<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use App\Services\DoctorService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DoctorController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function index(): JsonResponse
    {
        $doctors = Doctor::query()
            ->with(['user.roles'])
            ->latest()
            ->paginate(15);

        return $this->success(
            DoctorResource::collection($doctors)
        );
    }

    public function store(
        StoreDoctorRequest $request
    ): JsonResponse {
        $doctor = $this->doctorService->create(
            $request->validated()
        );

        return $this->created(
            new DoctorResource($doctor->load('user'))
        );
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return $this->success(
            new DoctorResource($doctor->load('user.roles'))
        );
    }

    public function update(
        UpdateDoctorRequest $request,
        Doctor $doctor
    ): JsonResponse {
        $doctor = $this->doctorService->update(
            $doctor,
            $request->validated()
        );

        return $this->updated(
            new DoctorResource($doctor->load('user'))
        );
    }
}
