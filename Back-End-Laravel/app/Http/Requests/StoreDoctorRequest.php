<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorRequest extends FormRequest
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
                'user_id' => [
                    'required',
                    'integer',
                    Rule::exists('users', 'id'),
                    Rule::unique('doctors', 'user_id'),
                ],
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],
            ],
        );
    }
}
