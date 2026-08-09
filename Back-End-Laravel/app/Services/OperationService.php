<?php

namespace App\Services;

use App\Models\Operation\Operation;
use App\Models\Operation\OperationItem;
use Illuminate\Support\Facades\DB;

class OperationService
{
    public function create(array $data): Operation
    {
        return DB::transaction(function () use ($data) {
            $operation = Operation::create([
                'doctor_id' => $data['doctor_id'],
                'patient_id' => $data['patient_id'],
                'hospital_id' => $data['hospital_id'],
                'operation_type_id' => $data['operation_type_id'],
                'operation_date' => $data['operation_date'],
                'side' => $data['side'] ?? null,
                'patient_access_code' => $data['patient_access_code'],
                'description' => $data['description'] ?? null,
            ]);

            $this->syncItems($operation, $data['items']);

            return $operation->load('items.product');
        });
    }

    public function update(Operation $operation, array $data): Operation
    {
        return DB::transaction(function () use ($operation, $data) {
            $operation->update(collect($data)->only([
                'doctor_id',
                'patient_id',
                'hospital_id',
                'operation_type_id',
                'operation_date',
                'side',
                'patient_access_code',
                'description',
            ])->all());

            if (isset($data['items'])) {
                $operation->items()->delete();
                $this->syncItems($operation, $data['items']);
            }

            return $operation->fresh()->load([
                'items.product',
                'doctor',
                'hospital',
                'patient',
                'operationType',
            ]);
        });
    }

    public function findPatientOperation(array $data): Operation
    {
        return Operation::query()
            ->where('patient_access_code', $data['code'])
            ->whereDate('operation_date', $data['date'])
            ->with([
                'patient',
                'doctor',
                'hospital',
                'items.product',
                'operationType',
            ])
            ->firstOrFail();
    }

    public function doctorOperations(int $doctorId, array $filters)
    {
        return Operation::query()
            ->where('doctor_id', $doctorId)
            ->when(
                $filters['hospital_id'] ?? null,
                fn($q, $hospital) => $q->where('hospital_id', $hospital)
            )
            ->when(
                $filters['date'] ?? null,
                fn($q, $date) => $q->whereDate('operation_date', $date)
            )
            ->with(['hospital', 'patient', 'operationType', 'items.product'])
            ->latest('operation_date')
            ->paginate($filters['per_page'] ?? 15);
    }

    private function syncItems(Operation $operation, array $items): void
    {
        foreach ($items as $item) {
            OperationItem::create([
                'operation_id' => $operation->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
            ]);
        }
    }
}
