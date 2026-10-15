<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindPatientOperationRequest;
use App\Http\Requests\StoreOperationRequest;
use App\Http\Requests\UpdateOperationRequest;
use App\Models\Operation\Operation;
use App\Services\OperationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected OperationService $operationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->hasAnyRole(['admin', 'data_entry']),
            403
        );

        $filters = $request->validate([
            'hospital_id' => ['sometimes', 'integer', 'exists:hospitals,id'],
            'doctor_id' => ['sometimes', 'integer', 'exists:doctors,id'],
            'date' => ['sometimes', 'date'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $operations = Operation::query()
            ->with([
                'doctor',
                'hospital',
                'patient',
                'operationType',
                'items.product',
            ])
            ->when(
                $filters['hospital_id'] ?? null,
                fn($query, $id) =>
                $query->where('hospital_id', $id)
            )
            ->when(
                $filters['doctor_id'] ?? null,
                fn($query, $id) =>
                $query->where('doctor_id', $id)
            )
            ->when(
                $filters['date'] ?? null,
                fn($query, $date) =>
                $query->whereDate('operation_date', $date)
            )
            ->latest('operation_date')
            ->paginate($filters['limit'] ?? 15);

        return $this->success($operations);
    }

    public function doctorIndex(Request $request): JsonResponse
    {
        abort_unless($request->user()?->hasRole('doctor'), 403);

        $doctor = $request->user()->doctor;

        if (! $doctor) {
            return $this->notFound('Doctor Profile Not Found.');
        }

        $filters = $request->validate([
            'hospital_id' => ['sometimes', 'integer', 'exists:hospitals,id'],
            'date' => ['sometimes', 'date'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $operations = $this->operationService->doctorOperations(
            $doctor->id,
            $filters
        );

        return $this->success($operations);
    }

    public function store(
        StoreOperationRequest $request
    ): JsonResponse {
        $data = $request->validated();

        if ($request->user()->hasRole('doctor')) {
            $doctor = $request->user()->doctor;

            if (! $doctor) {
                return $this->forbidden(
                    'Doctor Profile Required.'
                );
            }

            $data['doctor_id'] = $doctor->id;
        }

        $operation = $this->operationService->create($data);

        return $this->created($operation);
    }

    public function show(
        Request $request,
        Operation $operation
    ): JsonResponse {
        $user = $request->user();

        if ($user->hasRole('doctor')) {
            $doctor = $user->doctor;

            if (
                ! $doctor ||
                (int) $operation->doctor_id !== (int) $doctor->id
            ) {
                return $this->notFound(
                    'Operation Not Found.'
                );
            }
        } else {
            abort_unless(
                $user->hasAnyRole(['admin', 'data_entry']),
                403
            );
        }

        return $this->success(
            $operation->load([
                'doctor',
                'hospital',
                'patient',
                'operationType',
                'items.product',
            ])
        );
    }

    public function update(
        UpdateOperationRequest $request,
        Operation $operation
    ): JsonResponse {
        $operation = $this->operationService->update(
            $operation,
            $request->validated()
        );

        return $this->updated($operation);
    }

    public function findPatientOperation(
        FindPatientOperationRequest $request
    ): JsonResponse {
        $operation = $this->operationService
            ->findPatientOperation($request->validated());

        return $this->success($operation);
    }
}
