<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],
            'phone' => [
                'required',
                'string',
                'max:30',
            ],
            'email' => [
                'required',
                'email',
                'max:254',
            ],
            'subject' => [
                'required',
                Rule::in([
                    'Product Inquiry / Hospital Supply',
                    'Patient Operation Verification Assistance',
                    'Distribution & Brand Partnership',
                    'General Question',
                ]),
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
        ];
    }
}
