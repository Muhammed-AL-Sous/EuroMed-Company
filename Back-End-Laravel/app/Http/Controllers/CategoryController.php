<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(Category::all());
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
                'message' => 'لا يمكن حذف المجموعة لأنها مرتبطة بمنتجات.'
            ], 409);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المجموعة بنجاح.'
        ]);
    }
}
