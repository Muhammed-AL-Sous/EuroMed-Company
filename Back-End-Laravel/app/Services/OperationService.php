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

            return $operation
                ->load(self::RELATIONS)
                ->loadCount('items');
        });
    }

    public function update(
        Operation $operation,
        array $data
    ): Operation {
        return DB::transaction(function () use ($operation, $data) {

            // Lock operation during update
            $operation = Operation::query()
                ->lockForUpdate()
                ->findOrFail($operation->id);

            // Update operation fields
            $allowed = collect($data)->only([
                'doctor_id',
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

            // Synchronize items only if supplied
            if (array_key_exists('items', $data)) {
                $this->syncItems(
                    $operation,
                    $data['items']
                );
            }

            return $operation
                ->refresh()
                ->load(self::RELATIONS)
                ->loadCount('items');
        });
    }

    private function syncItems(
        Operation $operation,
        array $items
    ): void {
        $productIds = array_map(
            fn($item) => (int) $item['product_id'],
            $items
        );

        // Soft-delete items no longer present
        $operation->items()
            ->whereNotIn('product_id', $productIds)
            ->delete();

        foreach ($items as $itemData) {
            // Include soft-deleted items when searching
            $existingItem = $operation->items()
                ->withTrashed()
                ->where(
                    'product_id',
                    $itemData['product_id']
                )
                ->first();

            if ($existingItem) {
                $existingItem->quantity =
                    $itemData['quantity'];

                if ($existingItem->trashed()) {
                    $existingItem->restore();
                }

                $existingItem->save();
            } else {
                $operation->items()->create([
                    'product_id' =>
                    $itemData['product_id'],
                    'quantity' =>
                    $itemData['quantity'],
                ]);
            }
        }
    }

    public function doctorOperations(
        int $doctorId,
        array $filters = []
    ): LengthAwarePaginator {
        return Operation::query()
            ->where('doctor_id', $doctorId)

            // Search Filter
            ->when(
                filled($filters['search'] ?? null),
                function ($query) use ($filters) {

                    $terms = preg_split(
                        '/\s+/u',
                        trim($filters['search'])
                    );

                    foreach ($terms as $term) {
                        $like = "%{$term}%";

                        $query->where(function ($q) use ($like) {
                            $q
                                // Invoice Number
                                ->where(
                                    'invoice_number',
                                    'LIKE',
                                    $like
                                )

                                // Patient Access Code
                                ->orWhere(
                                    'patient_access_code',
                                    'LIKE',
                                    $like
                                )

                                // Doctor Name
                                ->orWhereHas(
                                    'doctor',
                                    fn($doctorQuery) =>
                                    $doctorQuery->where(
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                )

                                // Patient Name / Phone
                                ->orWhereHas(
                                    'patient',
                                    fn($patientQuery) =>
                                    $patientQuery
                                        ->where('name', 'LIKE', $like)
                                        ->orWhere('phone', 'LIKE', $like)
                                )

                                // Hospital Name
                                ->orWhereHas(
                                    'hospital',
                                    fn($hospitalQuery) =>
                                    $hospitalQuery->where(
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                )

                                // Operation Type Name
                                ->orWhereHas(
                                    'operationType',
                                    fn($typeQuery) =>
                                    $typeQuery->where(
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                );
                        });
                    }
                }
            )

            // Hospital Filter
            ->when(
                $filters['hospital_id'] ?? null,
                fn($query, $hospitalId) =>
                $query->where('hospital_id', $hospitalId)
            )

            // Date Filter
            ->when(
                $filters['date'] ?? null,
                fn($query, $date) =>
                $query->whereDate('operation_date', $date)
            )

            // Operation Type Filter
            ->when(
                $filters['operation_type_id'] ?? null,
                fn($query, $id) =>
                $query->where('operation_type_id', $id)
            )

            // Eager Loading
            ->with(self::RELATIONS)
            ->withCount('items')

            // Sorting
            ->latest('operation_date')
            ->latest('id')

            // Pagination
            ->paginate(
                min(
                    100,
                    max(
                        1,
                        (int) ($filters['per_page'] ?? 15)
                    )
                )
            );
    }
    public function findPatientOperation(
        array $data
    ): Operation {
        return Operation::query()
            ->where(
                'patient_access_code',
                $data['code']
            )
            ->whereDate(
                'operation_date',
                $data['date']
            )
            ->with(self::RELATIONS)
            ->withCount('items')
            ->firstOrFail();
    }
}
