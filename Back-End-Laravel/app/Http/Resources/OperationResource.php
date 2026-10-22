<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'invoice_number' => $this->invoice_number,
            
            'patient_access_code' => $this->patient_access_code,

            'operation_date' => $this->operation_date
                ?->format('Y-m-d'),

            'side' => $this->side,

            'description' => $this->description,

            // Foreign Keys
            'doctor_id' => $this->doctor_id,
            'patient_id' => $this->patient_id,
            'hospital_id' => $this->hospital_id,
            'operation_type_id' => $this->operation_type_id,

            // Relations
            'doctor' => $this->whenLoaded(
                'doctor',
                fn() => new DoctorResource($this->doctor)
            ),

            'patient' => $this->whenLoaded(
                'patient',
                fn() => new PatientResource($this->patient)
            ),

            'hospital' => $this->whenLoaded(
                'hospital',
                fn() => new HospitalResource($this->hospital)
            ),

            'operation_type' => $this->whenLoaded(
                'operationType',
                fn() => new OperationTypeResource($this->operationType)
            ),

            // Operation Items
            'items_count' => $this->whenCounted('items'),

            'items' => $this->whenLoaded(
                'items',
                fn() => OperationItemResource::collection(
                    $this->items
                )
            ),

            // Timestamps
            'created_at' => $this->created_at
                ?->toIso8601String(),

            'updated_at' => $this->updated_at
                ?->toIso8601String(),
        ];
    }
}
