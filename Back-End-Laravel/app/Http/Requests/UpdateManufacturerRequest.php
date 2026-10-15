<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateManufacturerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', "unique:manufacturers,name," . $this->route('manufacturer')->id],
            'origin' => ['sometimes', 'nullable', 'string', 'max:255'],
            'logo_text' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'website' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
