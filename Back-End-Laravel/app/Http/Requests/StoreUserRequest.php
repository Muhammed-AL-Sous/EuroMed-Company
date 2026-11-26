<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use App\Support\UsernameNormalizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
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
        return array_merge(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'username' => [
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                    'regex:/^[a-z0-9]+$/',
                    'unique:users,username',
                ],

                'email' => [
                    'nullable',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email'),
                ],

                'password' => [
                    'required',
                    'confirmed',
                    Password::min(6)
                        ->letters()
                        ->numbers(),
                ],

                'role' => [
                    'required',
                    'string',
                    Rule::in([
                        'admin',
                        'doctor',
                        'staff',
                    ]),
                ],

                'expires_at' => [
                    'nullable',
                    'date',
                ],

                'doctor' => [
                    'sometimes',
                    'required',
                    'array:name',

                    Rule::prohibitedIf(
                        fn() => $this->input('role') !== 'doctor'
                    ),
                ],

                'doctor.name' => [
                    'required_with:doctor',
                    'string',
                    'max:255',
                ],
            ],

        );
    }
}
