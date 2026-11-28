<?php

namespace App\Http\Requests;

use App\Support\UsernameNormalizer;
use Illuminate\Foundation\Http\FormRequest;

class AuthLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('username'))) {
            $this->merge([
                'username' => UsernameNormalizer::normalize(
                    $this->input('username')
                ),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9._-]+$/',
            ],
            'password' => ['required', 'string'],
            'email' => ['nullable', 'string', 'email'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }
}
