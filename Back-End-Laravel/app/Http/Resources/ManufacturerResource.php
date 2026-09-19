<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManufacturerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'origin' => $this->origin,
            'logo_text' => $this->logo_text,
            'website' => $this->website,
            'is_active' => $this->is_active,
            'description' => $this->description,
            'product_count' => $this->product_count,
        ];
    }
}
