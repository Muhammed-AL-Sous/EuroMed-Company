<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Hospital;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class HospitalController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(Hospital::all());
    }

    public function store(StoreHospitalRequest $request): JsonResponse
    {
        $hospital = Hospital::create($request->validated());

        return self::created($hospital);
    }

    public function show(Hospital $hospital): JsonResponse
    {
        return self::success($hospital);
    }

    public function update(UpdateHospitalRequest $request, Hospital $hospital): JsonResponse
    {
        $hospital->update($request->validated());

        return self::updated($hospital);
    }

    public function destroy(Hospital $hospital): JsonResponse
    {
        $hospital->delete();

        return self::deleted('Hospital Deleted Successfully.');
    }
}
