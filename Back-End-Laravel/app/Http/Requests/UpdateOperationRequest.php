<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $operationId = $this->route('operation')?->id ?? $this->route('operation');

        return [
            'doctor_id' => ['sometimes', 'required', 'exists:doctors,id'],
            'patient_id' => ['sometimes', 'required', 'exists:patients,id'],
            'hospital_id' => ['sometimes', 'required', 'exists:hospitals,id'],
            'operation_type_id' => ['sometimes', 'required', 'exists:operation_types,id'],
            'operation_date' => ['sometimes', 'required', 'date'],
            'side' => ['nullable', 'in:Left,Right,Bilateral'],
            'patient_access_code' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('operations', 'patient_access_code')->ignore($operationId),
            ],
            'description' => ['nullable', 'string'],
            'items' => ['sometimes', 'required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
