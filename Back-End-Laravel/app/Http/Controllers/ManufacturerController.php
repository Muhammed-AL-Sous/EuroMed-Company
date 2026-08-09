<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreManufacturerRequest;
use App\Http\Requests\UpdateManufacturerRequest;
use App\Models\Manufacturer;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ManufacturerController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(Manufacturer::all());
    }

    public function store(StoreManufacturerRequest $request): JsonResponse
    {
        $manufacturer = Manufacturer::create($request->validated());

        return self::created($manufacturer);
    }

    public function show(Manufacturer $manufacturer): JsonResponse
    {
        return self::success($manufacturer->load('products'));
    }

    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer): JsonResponse
    {
        $manufacturer->update($request->validated());

        return self::updated($manufacturer);
    }

    public function destroy(Manufacturer $manufacturer): JsonResponse
    {
        $manufacturer->delete();

        return self::deleted('Manufacturer Deleted Successfully.');
    }
}
