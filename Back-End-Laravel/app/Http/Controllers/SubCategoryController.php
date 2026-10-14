<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Http\Resources\SubCategoryResource;
use App\Models\SubCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        // Remove the uploaded file from the subcategory attributes.
        unset($validated['image']);

        // Store the image and save its relative path in the database.
        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')
                ->store('subcategories', 'public');
        }

        $subCategory = SubCategory::create($validated);

        return self::created(
            new SubCategoryResource($subCategory)
        );
    }

    public function show(SubCategory $subcategory): JsonResponse
    {
        return self::success($subcategory->load('products'));
    }

    public function update(UpdateSubCategoryRequest $request, SubCategory $subcategory): JsonResponse
    {
      $validated = $request->validated();

        // الاحتفاظ بالمسار الأصلي من قاعدة البيانات
        $oldImagePath = $subcategory->getRawOriginal('image_url');

        // هذه الحقول ليست أعمدة نريد تحديثها مباشرة
        unset($validated['image'], $validated['remove_image']);

        $newImagePath = null;
        $hasNewImage = $request->hasFile('image');
        $shouldRemoveImage = $request->boolean('remove_image');

        // عند رفع صورة جديدة، حفظها في مجلد subcategories
        if ($hasNewImage) {
            $newImagePath = $request->file('image')->store(
                'subcategories',
                'public'
            );

            $validated['image_url'] = $newImagePath;
        } elseif ($shouldRemoveImage) {
            // حذف الصورة من سجل الفئة الفرعية عند طلب الإزالة
            $validated['image_url'] = null;
        }

        // تحديث بيانات الفئة الفرعية
        $subcategory->update($validated);

        // حذف الصورة القديمة بعد نجاح تحديث سجل الفئة الفرعية
        if (
            $oldImagePath &&
            ($hasNewImage || $shouldRemoveImage)
        ) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return self::updated(
            new SubCategoryResource($subcategory)
        );
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
