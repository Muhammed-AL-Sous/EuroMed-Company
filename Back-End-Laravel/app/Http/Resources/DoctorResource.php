<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->getTranslations('name'),
            'specialization' => $this->getTranslations('specialization'),
            'profile_completed_at' => $this->profile_completed_at?->format('Y-m-d H:i:sA'),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at?->format('Y-m-d H:i:sA'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:sA'),
        ];
    }
}
