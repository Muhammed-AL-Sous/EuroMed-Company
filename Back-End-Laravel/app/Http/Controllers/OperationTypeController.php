<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationTypeRequest;
use App\Http\Requests\UpdateOperationTypeRequest;
use App\Models\Operation\OperationType;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class OperationTypeController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(OperationType::all());
    }

    public function store(StoreOperationTypeRequest $request): JsonResponse
    {
        $operationType = OperationType::create($request->validated());

        return self::created($operationType);
    }

    public function show(OperationType $operationType): JsonResponse
    {
        return self::success($operationType);
    }

    public function update(UpdateOperationTypeRequest $request, OperationType $operationType): JsonResponse
    {
        $operationType->update($request->validated());

        return self::updated($operationType);
    }

    public function destroy(OperationType $operationType): JsonResponse
    {
        $operationType->delete();

        return self::deleted('Operation Type Deleted Successfully.');
    }
}
