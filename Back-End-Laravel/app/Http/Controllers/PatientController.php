<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(Patient::latest()->paginate(15));
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = Patient::create($request->validated());

        return self::created($patient);
    }

    public function show(Patient $patient): JsonResponse
    {
        return self::success($patient->load('operations'));
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update($request->validated());

        return self::updated($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return self::deleted('Patient Deleted Successfully.');
    }
}
