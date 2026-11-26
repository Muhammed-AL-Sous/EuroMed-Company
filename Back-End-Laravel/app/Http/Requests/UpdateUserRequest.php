<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use App\Support\UsernameNormalizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
        /** @var \App\Models\User $user */
        $user = $this->route('user');

        $effectiveRole = $this->input('role')
            ?? $user->roles()->value('name');

        return array_merge(
            [
                'name' => [
                    'sometimes',
                    'required',
                    'string',
                    'max:100',
                ],

                'username' => [
                    'sometimes',
                    'required',
                    'string',
                    'min:3',
                    'max:50',
                    'regex:/^[a-z0-9]+$/',
                    Rule::unique('users', 'username')
                        ->ignore($user),
                ],

                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')
                        ->ignore($user),
                ],

                'password' => [
                    'sometimes',
                    'nullable',
                    'confirmed',
                    Password::min(6)
                        ->letters()
                        ->numbers(),
                ],

                'role' => [
                    'sometimes',
                    'required',
                    'string',
                    Rule::in([
                        'admin',
                        'doctor',
                        'staff',
                    ]),
                ],

                'expires_at' => [
                    'sometimes',
                    'nullable',
                    'date',
                ],

                'is_active' => [
                    'sometimes',
                    'boolean',
                ],

                'doctor' => [
                    'sometimes',
                    'required',
                    'array:name',

                    Rule::prohibitedIf(
                        fn() => $effectiveRole !== 'doctor'
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
