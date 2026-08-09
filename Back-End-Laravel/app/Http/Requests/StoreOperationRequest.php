<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'doctor_id' => ['required', 'exists:doctors,id'],
            'patient_id' => ['required', 'exists:patients,id'],
            'hospital_id' => ['required', 'exists:hospitals,id'],
            'operation_type_id' => ['required', 'exists:operation_types,id'],
            'operation_date' => ['required', 'date'],
            'side' => ['nullable', 'in:Left,Right,Bilateral'],
            'patient_access_code' => ['required', 'string', 'max:255', 'unique:operations,patient_access_code'],
            'description' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
