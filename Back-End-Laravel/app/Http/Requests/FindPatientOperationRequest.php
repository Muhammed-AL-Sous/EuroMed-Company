<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FindPatientOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ];
    }
}
