<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Http\Resources\HospitalResource;
use App\Models\Hospital;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $hospitals = Hospital::query()
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->search;
                    $query->where('name', 'like', "%{$search}%");
                }
            )
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return self::success(
            HospitalResource::collection($hospitals)
        );
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
