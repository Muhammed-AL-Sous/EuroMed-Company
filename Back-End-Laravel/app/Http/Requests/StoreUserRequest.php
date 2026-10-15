<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
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

    public function rules(): array
    {
        return array_merge(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email'),
                ],

                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)
                        ->letters()
                        ->numbers(),
                ],

                'role' => [
                    'required',
                    'string',
                    Rule::in([
                        'admin',
                        'doctor',
                        'data_entry',
                    ]),
                ],

                'expires_at' => [
                    'nullable',
                    'date',
                ],

                'doctor' => [
                    'sometimes',
                    'required',
                    'array:name,specialization',

                    Rule::prohibitedIf(
                        fn() => $this->input('role') !== 'doctor'
                    ),
                ],
            ],

            $this->translatableFieldRules(
                'doctor.name',
                false,
                'doctor'
            ),

            $this->translatableFieldRules(
                'doctor.specialization',
                false,
                'doctor'
            ),
        );
    }
}
