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
            'data_entry',
        ]) ?? false;
    }

    public function rules(): array
    {
        $operation = $this->route('operation');

        return [
            'doctor_id' => ['prohibited'],

            'items' => ['prohibited'],

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
        ];
    }
}
