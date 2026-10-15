<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
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

    public function rules(): array
    {
        $user = $this->route('user');

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
                    Password::min(8)
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
                        'data_entry',
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
                    'array:name,specialization',

                    Rule::prohibitedIf(
                        fn() => $effectiveRole !== 'doctor'
                    ),
                ],
            ],

            $this->translatableFieldRules(
                'doctor.name',
                false
            ),

            $this->translatableFieldRules(
                'doctor.specialization',
                false
            ),
        );
    }
}
