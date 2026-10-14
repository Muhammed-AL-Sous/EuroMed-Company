<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreManufacturerRequest;
use App\Http\Requests\UpdateManufacturerRequest;
use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManufacturerController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $manufacturers = Manufacturer::query()
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $terms = preg_split('/\s+/', trim($request['search'])) ?: [];
                    $terms = array_values(array_filter($terms, fn($t) => $t !== ''));

                    $query->where(function ($qq) use ($terms) {
                        foreach ($terms as $term) {
                            $like = '%' . $term . '%';
                            $qq->where(function ($q3) use ($like) {
                                $q3->where('name', 'like', $like);
                            });
                        }
                    });
                }
            )
            ->withCount('products')
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return self::success(
            ManufacturerResource::collection($manufacturers)
        );
    }


    public function store(StoreManufacturerRequest $request): JsonResponse
    {
        $manufacturer = Manufacturer::create($request->validated());

        return self::created($manufacturer);
    }

    public function show(Manufacturer $manufacturer): JsonResponse
    {
        return self::success($manufacturer->load('products'));
    }

    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer): JsonResponse
    {
        $manufacturer->update($request->validated());

        return self::updated($manufacturer);
    }

    public function destroy(Manufacturer $manufacturer): JsonResponse
    {
        if ($manufacturer->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => "The Manufacturer Can't be Deleted Because it is Linked to Products."
            ], 409);
        }

        $manufacturer->delete();

        return response()->json([
            'success' => true,
            'message' => "The Manufacturer has been Deleted Successfully."
        ]);
    }
}
