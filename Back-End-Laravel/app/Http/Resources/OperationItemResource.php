<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'operation_id' => $this->operation_id,

            'product_id' => $this->product_id,

            'quantity' => $this->quantity,

            'product' => $this->whenLoaded(
                'product',
                fn() => new ProductResource($this->product)
            ),

            'created_at' => $this->created_at
                ?->toIso8601String(),

            'updated_at' => $this->updated_at
                ?->toIso8601String(),
        ];
    }
}
