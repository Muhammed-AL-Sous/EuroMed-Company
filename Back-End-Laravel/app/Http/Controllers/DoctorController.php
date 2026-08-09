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
        return self::success(
            DoctorResource::collection(Doctor::with('user')->get())
        );
    }

    public function store(StoreDoctorRequest $request): JsonResponse
    {
        $doctor = $this->doctorService->create($request->validated());

        return self::created(new DoctorResource($doctor->load('user')));
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return self::success(new DoctorResource($doctor->load('user')));
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): JsonResponse
    {
        $doctor = $this->doctorService->update($doctor, $request->validated());

        return self::updated(new DoctorResource($doctor->load('user')));
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        $doctor->delete();

        return self::deleted('Doctor Deleted Successfully.');
    }
}
