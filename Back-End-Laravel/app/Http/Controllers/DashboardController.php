<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    public function overview(Request $request): JsonResponse
    {
        $user = $request->user();

        $canViewAll = $user->hasAnyRole([
            'admin',
            'staff',
        ]);

        abort_unless(
            $canViewAll || $user->hasRole('doctor'),
            403
        );

        // Doctors only access their own operations.
        // ID 0 produces empty results if the profile is missing.
        $doctorId = $canViewAll
            ? null
            : ($user->doctor()->value('id') ?? 0);

        $operations = fn() => DB::table('operations as o')
            ->when(
                $doctorId !== null,
                fn($query) => $query->where(
                    'o.doctor_id',
                    $doctorId
                )
            );

        $operationItems = fn() => DB::table('operation_items as oi')
            ->join(
                'operations as o',
                'o.id',
                '=',
                'oi.operation_id'
            )
            ->when(
                $doctorId !== null,
                fn($query) => $query->where(
                    'o.doctor_id',
                    $doctorId
                )
            );

        $materialDemand = $operationItems()
            ->join(
                'products as p',
                'p.id',
                '=',
                'oi.product_id'
            )
            ->join(
                'categories as c',
                'c.id',
                '=',
                'p.category_id'
            )
            ->select([
                'c.id',
                'c.name',
            ])
            ->selectRaw('SUM(oi.quantity) AS total_quantity')
            ->groupBy('c.id', 'c.name')
            ->orderByDesc('total_quantity')
            ->get()
            ->map(fn($category) => [
                'category' => $category->name,
                'count' => (int) $category->total_quantity,
            ]);


        // 1. Overview statistics
        $stats = [
            'total_operations' => $operations()->count(),

            'operations_this_month' => $operations()
                ->where(
                    'o.operation_date',
                    '>=',
                    now()->startOfMonth()->toDateString()
                )
                ->where(
                    'o.operation_date',
                    '<=',
                    today()->toDateString()
                )
                ->count(),

            'doctors' => $canViewAll
                ? DB::table('doctors')->count()
                : ($doctorId > 0 ? 1 : 0),

            'patients' => $canViewAll
                ? DB::table('patients')->count()
                : $operations()
                ->distinct()
                ->count('o.patient_id'),

            'hospitals' => $canViewAll
                ? DB::table('hospitals')->count()
                : $operations()
                ->distinct()
                ->count('o.hospital_id'),

            'products' => $canViewAll
                ? DB::table('products')->count()
                : $operationItems()
                ->distinct()
                ->count('oi.product_id'),
        ];

        // 2. Operations grouped by month (last 6 months)
        $startMonth = now()
            ->startOfMonth()
            ->subMonths(5);

        $monthlyRows = $operations()
            ->where(
                'o.operation_date',
                '>=',
                $startMonth->toDateString()
            )
            ->where(
                'o.operation_date',
                '<=',
                today()->toDateString()
            )
            ->selectRaw('
                YEAR(o.operation_date) AS year,
                MONTH(o.operation_date) AS month,
                COUNT(*) AS total
            ')
            ->groupByRaw('
                YEAR(o.operation_date),
                MONTH(o.operation_date)
            ')
            ->get()
            ->keyBy(
                fn($row) => sprintf(
                    '%04d-%02d',
                    $row->year,
                    $row->month
                )
            );

        $monthlyOperations = collect(range(0, 5))
            ->map(function ($index) use (
                $startMonth,
                $monthlyRows
            ) {
                $month = $startMonth
                    ->copy()
                    ->addMonths($index)
                    ->format('Y-m');

                return [
                    'month' => $month,
                    'total' => (int) (
                        $monthlyRows->get($month)?->total ?? 0
                    ),
                ];
            })
            ->values();

        // 3. Most used products
        $topProducts = $operationItems()
            ->join(
                'products as p',
                'p.id',
                '=',
                'oi.product_id'
            )
            ->select('p.id', 'p.name')
            ->selectRaw('
                SUM(oi.quantity) AS total_quantity
            ')
            ->groupBy('p.id', 'p.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'total_quantity' => (int) $product->total_quantity,
            ]);

        // 4. Latest registered operations
        $recentOperations = $operations()
            ->leftJoin(
                'doctors as d',
                'd.id',
                '=',
                'o.doctor_id'
            )
            ->leftJoin(
                'hospitals as h',
                'h.id',
                '=',
                'o.hospital_id'
            )
            ->leftJoin(
                'patients as p',
                'p.id',
                '=',
                'o.patient_id'
            )
            ->select([
                'o.id',
                'o.invoice_number',
                'o.operation_date',
                'd.name as doctor_name',
                'h.name as hospital_name',
                'p.name as patient_name',
            ])
            ->orderByDesc('o.created_at')
            ->orderByDesc('o.id')
            ->limit(5)
            ->get();

        return $this->success([
            'viewer' => [
                'role' => $canViewAll
                    ? 'management'
                    : 'doctor',
                'profile_required' => ! $canViewAll
                    && $doctorId === 0,
            ],
            'stats' => $stats,
            'monthly_operations' => $monthlyOperations,
            'top_products' => $topProducts,
            'recent_operations' => $recentOperations,
            'material_demand_by_category' => $materialDemand,
        ]);
    }
}
