<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:255',
                'unique:products,code',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'manufacturer_id' => [
                'required',
                'integer',
                'exists:manufacturers,id',
            ],

            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            'subcategory_id' => [
                'required',
                'integer',
                'exists:subcategories,id',
            ],

            'price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'image_url' => [
                'nullable',
                'url',
            ],

            'medical_usage' => [
                'nullable',
                'string',
            ],

            'specifications' => [
                'nullable',
                'array',
            ],

            'available_sizes' => [
                'nullable',
                'array',
            ],
        ];
    }
}
