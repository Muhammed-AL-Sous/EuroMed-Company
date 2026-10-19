<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return array_merge(
            [
                'user_id' => ['prohibited'],

                'name' => [
                    'sometimes',
                    'string',
                    'max:255',
                ],
            ]
        );
    }
}
