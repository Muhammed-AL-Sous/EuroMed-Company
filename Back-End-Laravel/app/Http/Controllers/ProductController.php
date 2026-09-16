<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with(['manufacturer', 'category', 'subCategory'])
            ->when(
                $request->query('category_id'),
                fn($q, $categoryId) => $q->where('category_id', $categoryId)
            )
            ->when(
                $request->query('manufacturer_id'),
                fn($q, $manufacturerId) => $q->where('manufacturer_id', $manufacturerId)
            )
            ->when(
                $request->query('subcategory_id'),
                fn($q, $subcategoryId) => $q->where('subcategory_id', $subcategoryId)
            )
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->search;

                    $query->where('name', 'like', "%{$search}%");
                }
            )
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return self::success($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return self::created($product->load(['manufacturer', 'category', 'subCategory']));
    }

    public function show(Product $product): JsonResponse
    {
        return self::success($product->load(['manufacturer', 'category', 'subCategory']));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return self::updated($product->load(['manufacturer', 'category', 'subCategory']));
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return self::deleted('Product Deleted Successfully.');
    }
}
