<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'required', 'string', 'max:255', "unique:categories,code," . $this->route('category')->id],
            'name' => ['sometimes', 'required', 'string', 'max:255', "unique:categories,name," . $this->route('category')->id],
            'description' => ['nullable', 'string'],
        ];
    }
}
