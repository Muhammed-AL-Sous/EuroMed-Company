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
        $operations = Operation::query()
            ->with(['doctor', 'hospital', 'patient', 'operationType', 'items.product'])
            ->when(
                $request->query('hospital_id'),
                fn($q, $hospitalId) => $q->where('hospital_id', $hospitalId)
            )
            ->when(
                $request->query('doctor_id'),
                fn($q, $doctorId) => $q->where('doctor_id', $doctorId)
            )
            ->when(
                $request->query('date'),
                fn($q, $date) => $q->whereDate('operation_date', $date)
            )
            ->latest('operation_date');

        // Search
        if ($request->filled('search')) {
            $searchTerm = $request->query('search');

            $operations->where(function ($query) use ($searchTerm) {
                $query->whereHas('doctor', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                })
                    ->orWhereHas('hospital', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('patient', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('operationType', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Pagination
        $limit = (int) $request->query('limit', 10);
        $operations = $operations->paginate($limit)->appends($request->query());

        return self::success($operations);
    }

    public function doctorIndex(Request $request): JsonResponse
    {
        $operations = $this->operationService->doctorOperations($request->user()->doctor->id, [
            'hospital_id' => $request->query('hospital_id'),
            'date' => $request->query('date'),
            'per_page' => $request->integer('per_page', 15),
        ]);

        return self::success($operations);
    }

    public function store(StoreOperationRequest $request): JsonResponse
    {
        if ($request->user()?->hasRole('doctor')) {
            $doctor = $request->user()->doctor;

            if (! $doctor || (int) $request->input('doctor_id') !== $doctor->id) {
                return self::forbidden('You can only create operations for your own profile.');
            }
        }

        $operation = $this->operationService->create($request->validated());

        return self::created($operation);
    }

    public function show(Request $request, Operation $operation): JsonResponse
    {
        if ($request->user()?->hasRole('doctor')) {
            $doctor = $request->user()->doctor;

            if (! $doctor || $operation->doctor_id !== $doctor->id) {
                return self::forbidden('You are not authorized to view this operation.');
            }
        }

        return self::success($operation->load([
            'doctor',
            'hospital',
            'patient',
            'operationType',
            'items.product',
        ]));
    }

    public function update(UpdateOperationRequest $request, Operation $operation): JsonResponse
    {
        $operation = $this->operationService->update($operation, $request->validated());

        return self::updated($operation);
    }

    public function destroy(Operation $operation): JsonResponse
    {
        $operation->delete();

        return self::deleted('Operation Deleted Successfully.');
    }

    public function findPatientOperation(FindPatientOperationRequest $request): JsonResponse
    {
        $operation = $this->operationService->findPatientOperation($request->validated());

        return self::success($operation);
    }
}
