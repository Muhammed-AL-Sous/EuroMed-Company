<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $this->route('user')->id],
            'password' => ['nullable', 'confirmed', Password::min(8)->letters()->numbers()],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'data_entry', 'doctor'])],
        ];
    }
}
