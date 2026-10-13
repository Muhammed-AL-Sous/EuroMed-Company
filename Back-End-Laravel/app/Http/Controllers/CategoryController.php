<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $categories = Category::query()
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
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return self::success(
            CategoryResource::collection($categories)
        );
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return self::created($category);
    }

    public function show(Category $category): JsonResponse
    {
        return self::success($category->load('products'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return self::updated($category);
    }


    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => "The Category Can't be Deleted Because it is Linked to Products."
            ], 409);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => "The Category has been Deleted Successfully."
        ]);
    }
}
