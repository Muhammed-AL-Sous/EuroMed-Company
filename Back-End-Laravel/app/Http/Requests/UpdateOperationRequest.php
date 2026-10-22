<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole([
            'admin',
            'staff',
        ]) ?? false;
    }

    public function rules(): array
    {
        $operation = $this->route('operation');

        return [
            'doctor_id' => ['prohibited'],

            'patient_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:patients,id',
            ],

            'hospital_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:hospitals,id',
            ],

            'operation_type_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:operation_types,id',
            ],

            'operation_date' => [
                'sometimes',
                'required',
                'date',
            ],

            'side' => [
                'sometimes',
                'nullable',
                Rule::in(['Left', 'Right', 'Bilateral']),
            ],

            'patient_access_code' => [
                'sometimes',
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'operations',
                    'patient_access_code'
                )->ignore($operation),
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'items' => [
                'sometimes',
                'array',
                'min:1',
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
