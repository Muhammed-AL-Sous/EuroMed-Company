<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'medical_usage' => $this->medical_usage,
            'specifications' => $this->specifications,
            'available_sizes' => $this->available_sizes,
            'price' => (float) $this->price,
            'image_url' => $this->image_url,

            'category' => new CategoryResource(
                $this->whenLoaded('category')
            ),

            'subcategory' => new SubCategoryResource(
                $this->whenLoaded('subCategory')
            ),

            'manufacturer' => new ManufacturerResource(
                $this->whenLoaded('manufacturer')
            ),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
