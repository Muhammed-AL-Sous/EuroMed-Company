<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
                    $terms = preg_split('/\s+/', trim($request['search'])) ?: [];
                    $terms = array_values(array_filter($terms, fn($t) => $t !== ''));

                    $query->where(function ($qq) use ($terms) {
                        foreach ($terms as $term) {
                            $like = '%' . $term . '%';
                            $qq->where(function ($q3) use ($like) {
                                $q3->where('name', 'like', $like)
                                    ->orWhere('code', 'like', $like);
                            });
                        }
                    });
                }
            )
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return self::success(
            ProductResource::collection($products)
        );
    }


    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Remove the uploaded file from the product attributes.
        unset($validated['image']);

        // Store the image and save its relative path in the database.
        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')
                ->store('products', 'public');
        }

        $product = Product::create($validated);

        return self::created(
            $product->load([
                'manufacturer',
                'category',
                'subCategory',
            ])
        );
    }


    public function show(Product $product): JsonResponse
    {
        return self::success($product->load(['manufacturer', 'category', 'subCategory']));
    }

    public function update(
        UpdateProductRequest $request,
        Product $product
    ): JsonResponse {
        $validated = $request->validated();

        // الاحتفاظ بالمسار الأصلي من قاعدة البيانات
        $oldImagePath = $product->getRawOriginal('image_url');

        // هذه الحقول ليست أعمدة نريد تحديثها مباشرة
        unset($validated['image'], $validated['remove_image']);

        $newImagePath = null;
        $hasNewImage = $request->hasFile('image');
        $shouldRemoveImage = $request->boolean('remove_image');

        // عند رفع صورة جديدة، حفظها في مجلد products
        if ($hasNewImage) {
            $newImagePath = $request->file('image')->store(
                'products',
                'public'
            );

            $validated['image_url'] = $newImagePath;
        } elseif ($shouldRemoveImage) {
            // حذف الصورة من سجل المنتج عند طلب الإزالة
            $validated['image_url'] = null;
        }

        // تحديث بيانات المنتج
        $product->update($validated);

        // حذف الصورة القديمة بعد نجاح تحديث سجل المنتج
        if (
            $oldImagePath &&
            ($hasNewImage || $shouldRemoveImage)
        ) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return self::updated(
            $product->fresh()->load([
                'manufacturer',
                'category',
                'subCategory',
            ])
        );
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return self::deleted('Product Deleted Successfully.');
    }
}
