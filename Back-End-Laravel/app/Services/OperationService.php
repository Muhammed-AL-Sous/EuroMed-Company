<?php

namespace App\Services;

use App\Models\Operation\Operation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OperationService
{
    private const RELATIONS = [
        'doctor',
        'hospital',
        'patient',
        'operationType',
        'items.product',
    ];

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

            foreach ($data['items'] as $item) {
                $operation->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $operation->load(self::RELATIONS);
        });
    }

    public function update(
        Operation $operation,
        array $data
    ): Operation {
        return DB::transaction(function () use ($operation, $data) {

            $allowed = collect($data)->only([
                'patient_id',
                'hospital_id',
                'operation_type_id',
                'operation_date',
                'side',
                'patient_access_code',
                'description',
            ])->all();

            if ($allowed !== []) {
                $operation->update($allowed);
            }

            return $operation->refresh()->load(
                self::RELATIONS
            );
        });
    }

    public function doctorOperations(
        int $doctorId,
        array $filters
    ): LengthAwarePaginator {
        return Operation::query()
            ->where('doctor_id', $doctorId)
            ->when(
                $filters['hospital_id'] ?? null,
                fn($query, $hospitalId) =>
                $query->where('hospital_id', $hospitalId)
            )
            ->when(
                $filters['date'] ?? null,
                fn($query, $date) =>
                $query->whereDate('operation_date', $date)
            )
            ->with(self::RELATIONS)
            ->latest('operation_date')
            ->paginate(
                min(100, max(1, (int) ($filters['per_page'] ?? 15)))
            );
    }

    public function findPatientOperation(array $data): Operation
    {
        return Operation::query()
            ->where('patient_access_code', $data['code'])
            ->whereDate('operation_date', $data['date'])
            ->with(self::RELATIONS)
            ->firstOrFail();
    }
}
