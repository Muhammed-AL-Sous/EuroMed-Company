<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOperationItemRequest;
use App\Http\Requests\UpdateOperationItemRequest;
use App\Models\Operation\Operation;
use App\Models\Operation\OperationItem;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class OperationItemController extends Controller
{
    use ApiResponse;

    public function index(
        Request $request,
        Operation $operation
    ): JsonResponse {
        $this->ensureCanView($request, $operation);

        return $this->success(
            $operation->items()
                ->with('product')
                ->get()
        );
    }

    public function store(
        StoreOperationItemRequest $request,
        Operation $operation
    ): JsonResponse {
        $data = $request->validated();

        $item = DB::transaction(function () use ($operation, $data) {

            $exists = $operation->items()
                ->where('product_id', $data['product_id'])
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'product_id' =>
                    'Product Already Exists In This Operation.',
                ]);
            }

            return $operation->items()->create($data);
        });

        return $this->created(
            $item->load('product')
        );
    }

    public function show(
        Request $request,
        OperationItem $item
    ): JsonResponse {
        $this->ensureCanView(
            $request,
            $item->operation
        );

        return $this->success(
            $item->load(['product', 'operation'])
        );
    }

    public function update(
        UpdateOperationItemRequest $request,
        OperationItem $item
    ): JsonResponse {
        $data = $request->validated();

        $item = DB::transaction(function () use ($item, $data) {

            if (isset($data['product_id'])) {

                $exists = OperationItem::query()
                    ->where('operation_id', $item->operation_id)
                    ->where('product_id', $data['product_id'])
                    ->whereKeyNot($item->id)
                    ->exists();

                if ($exists) {
                    throw ValidationException::withMessages([
                        'product_id' =>
                        'Product Already Exists In This Operation.',
                    ]);
                }
            }

            $item->update($data);

            return $item->refresh();
        });

        return $this->updated(
            $item->load('product')
        );
    }


    private function ensureCanView(
        Request $request,
        Operation $operation
    ): void {
        $user = $request->user();

        abort_unless($user, 401);

        if ($user->hasAnyRole(['admin', 'staff'])) {
            return;
        }

        if ($user->hasRole('doctor')) {
            $doctor = $user->doctor;

            if (
                $doctor &&
                (int) $operation->doctor_id === (int) $doctor->id
            ) {
                return;
            }

            abort(404);
        }

        abort(403);
    }
}
