<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'code')->ignore($this->route('product')),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'manufacturer_id' => ['sometimes', 'required', 'exists:manufacturers,id'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'subcategory_id' => ['sometimes', 'required', 'exists:subcategories,id'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ];
    }
}
