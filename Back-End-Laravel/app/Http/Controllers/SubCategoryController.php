<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Models\SubCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SubCategoryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return self::success(SubCategory::all());
    }

    public function getSubCategories(): JsonResponse
    {
        return self::success(SubCategory::all());
    }

    public function store(StoreSubCategoryRequest $request): JsonResponse
    {
        $subCategory = SubCategory::create($request->validated());

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

    public function destroy(SubCategory $subcategory): JsonResponse
    {
        $subcategory->delete();

        return self::deleted('SubCategory Deleted Successfully.');
    }
}
