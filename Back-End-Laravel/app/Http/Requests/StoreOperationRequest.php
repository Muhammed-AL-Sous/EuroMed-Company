<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([
            'admin',
            'staff',
            'doctor',
        ]) ?? false;
    }

    public function rules(): array
    {
        $isDoctor = $this->user()?->hasRole('doctor') ?? false;

        return [
            'doctor_id' => [
                Rule::requiredIf(! $isDoctor),
                Rule::prohibitedIf($isDoctor),
                'integer',
                Rule::exists('doctors', 'id'),
            ],

            'patient_id' => [
                'required',
                'integer',
                'exists:patients,id',
            ],

            'hospital_id' => [
                'required',
                'integer',
                'exists:hospitals,id',
            ],

            'operation_type_id' => [
                'required',
                'integer',
                'exists:operation_types,id',
            ],

            'operation_date' => [
                'required',
                'date',
            ],

            'side' => [
                'nullable',
                Rule::in(['Left', 'Right', 'Bilateral']),
            ],

            'patient_access_code' => [
                'required',
                'string',
                'max:255',
                Rule::unique(
                    'operations',
                    'patient_access_code'
                ),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*' => [
                'required',
                'array:product_id,quantity',
            ],

            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }
}
