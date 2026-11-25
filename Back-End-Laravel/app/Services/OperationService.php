<?php

namespace App\Services;

use App\Models\Operation\Operation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class OperationService
{
    private const RELATIONS = [
        'doctor',
        'hospital',
        'patient',
        'operationType',
    ];

    private const OPERATION_FIELDS = [
        'doctor_id',
        'patient_id',
        'hospital_id',
        'operation_type_id',
        'operation_date',
        'side',
        'patient_access_code',
        'description',
    ];

    /**
     * Create a new operation.
     */
    public function create(array $data): Operation
    {
        return DB::transaction(function () use ($data) {

            $operation = Operation::create(
                Arr::only($data, self::OPERATION_FIELDS)
            );

            $this->syncItems(
                $operation,
                $data['items'] ?? []
            );

            return $operation
                ->load([
                    ...self::RELATIONS,
                    'items.product',
                ])
                ->loadCount('items');
        });
    }

    /**
     * Update an existing operation.
     */
    public function update(
        Operation $operation,
        array $data
    ): Operation {
        return DB::transaction(function () use ($operation, $data) {

            $operation = Operation::query()
                ->lockForUpdate()
                ->findOrFail($operation->id);

            $operation->update(
                Arr::only($data, self::OPERATION_FIELDS)
            );

            if (array_key_exists('items', $data)) {
                $this->syncItems(
                    $operation,
                    $data['items']
                );
            }

            return $operation
                ->refresh()
                ->load([
                    ...self::RELATIONS,
                    'items.product',
                ])
                ->loadCount('items');
        });
    }

    /**
     * Synchronize operation items.
     */
    private function syncItems(
        Operation $operation,
        array $items
    ): void {
        $productIds = array_column(
            $items,
            'product_id'
        );

        $operation->items()
            ->whereNotIn('product_id', $productIds)
            ->delete();

        foreach ($items as $item) {

            $operationItem = $operation->items()
                ->withTrashed()
                ->updateOrCreate(
                    [
                        'product_id' => $item['product_id'],
                    ],
                    [
                        'quantity' => $item['quantity'],
                    ]
                );

            if ($operationItem->trashed()) {
                $operationItem->restore();
            }
        }
    }

    /**
     * Get operations for admin and staff.
     */
    public function operations(
        array $filters = []
    ): LengthAwarePaginator {
        return $this->getOperations(
            Operation::query(),
            $filters
        );
    }

    /**
     * Get operations belonging to a specific doctor.
     */
    public function doctorOperations(
        int $doctorId,
        array $filters = []
    ): LengthAwarePaginator {
        return $this->getOperations(
            Operation::query()
                ->where('doctor_id', $doctorId),
            $filters
        );
    }

    /**
     * Apply search, filters and pagination.
     */
    private function getOperations(
        Builder $query,
        array $filters
    ): LengthAwarePaginator {

        return $query

            // Search
            ->when(
                filled($filters['search'] ?? null),
                function (Builder $query) use ($filters) {

                    $terms = preg_split(
                        '/\s+/u',
                        trim($filters['search']),
                        -1,
                        PREG_SPLIT_NO_EMPTY
                    );

                    foreach ($terms as $term) {

                        $like = "%{$term}%";

                        $query->where(
                            function (Builder $q) use ($like) {

                                $q->where(
                                    'invoice_number',
                                    'LIKE',
                                    $like
                                )
                                    ->orWhere(
                                        'patient_access_code',
                                        'LIKE',
                                        $like
                                    )
                                    ->orWhereRelation(
                                        'doctor',
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                    ->orWhereRelation(
                                        'patient',
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                    ->orWhereRelation(
                                        'patient',
                                        'phone',
                                        'LIKE',
                                        $like
                                    )
                                    ->orWhereRelation(
                                        'hospital',
                                        'name',
                                        'LIKE',
                                        $like
                                    )
                                    ->orWhereRelation(
                                        'operationType',
                                        'name',
                                        'LIKE',
                                        $like
                                    );
                            }
                        );
                    }
                }
            )

            // Doctor Filter
            ->when(
                $filters['doctor_id'] ?? null,
                fn(Builder $query, $id) =>
                $query->where('doctor_id', $id)
            )

            // Hospital Filter
            ->when(
                $filters['hospital_id'] ?? null,
                fn(Builder $query, $id) =>
                $query->where('hospital_id', $id)
            )

            // Operation Type Filter
            ->when(
                $filters['operation_type_id'] ?? null,
                fn(Builder $query, $id) =>
                $query->where('operation_type_id', $id)
            )

            // Date Filter
            ->when(
                $filters['date'] ?? null,
                fn(Builder $query, $date) =>
                $query->where('operation_date', $date)
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
                        (int) (
                            $filters['per_page']
                            ?? $filters['limit']
                            ?? 15
                        )
                    )
                )
            );
    }

    /**
     * Find an operation using patient access credentials.
     */
    public function findPatientOperation(
        array $data
    ): Operation {
        return Operation::query()
            ->where(
                'patient_access_code',
                $data['code']
            )
            ->where(
                'operation_date',
                $data['date']
            )
            ->with([
                ...self::RELATIONS,
                'items.product',
            ])
            ->withCount('items')
            ->firstOrFail();
    }
}
