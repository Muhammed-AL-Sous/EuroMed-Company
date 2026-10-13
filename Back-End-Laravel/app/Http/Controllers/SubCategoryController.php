<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Http\Resources\SubCategoryResource;
use App\Models\SubCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $subcategories = SubCategory::query()
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
            SubCategoryResource::collection($subcategories)
        );
    }

    public function store(StoreSubCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image'] = $request
                ->file('image')
                ->store('subcategories', 'public');
        }

        $subCategory = SubCategory::create($validated);

        return self::created($subCategory);
    }

    public function show(SubCategory $subcategory): JsonResponse
    {
        return self::success($subcategory->load('products'));
    }

    public function update(UpdateSubCategoryRequest $request, SubCategory $subcategory): JsonResponse
    {
        $subcategory->update($request->validated());

        return self::updated($subcategory);
    }

    public function destroy(SubCategory $subcategory)
    {
        if ($subcategory->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => "The SubCategory Can't be Deleted Because it is Linked to Products."
            ], 409);
        }

        $subcategory->delete();

        return response()->json([
            'success' => true,
            'message' => "The SubCategory has been Deleted Successfully."
        ]);
    }
}
