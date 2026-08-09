<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationItemRequest;
use App\Http\Requests\UpdateOperationItemRequest;
use App\Models\Operation\Operation;
use App\Models\Operation\OperationItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class OperationItemController extends Controller
{
    use ApiResponse;

    public function index(Operation $operation): JsonResponse
    {
        return self::success($operation->items()->with('product')->get());
    }

    public function store(StoreOperationItemRequest $request, Operation $operation): JsonResponse
    {
        $item = $operation->items()->create($request->validated());

        return self::created($item->load('product'));
    }

    public function show(OperationItem $item): JsonResponse
    {
        return self::success($item->load(['product', 'operation']));
    }

    public function update(UpdateOperationItemRequest $request, OperationItem $item): JsonResponse
    {
        $item->update($request->validated());

        return self::updated($item->load('product'));
    }

    public function destroy(OperationItem $item): JsonResponse
    {
        $item->delete();

        return self::deleted('Operation item deleted successfully.');
    }
}
