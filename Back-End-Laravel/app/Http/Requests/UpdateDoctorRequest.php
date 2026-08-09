<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return array_merge(
            [
                'user_id' => [
                    'nullable',
                    'exists:users,id',
                    Rule::unique('doctors', 'user_id')->ignore($this->route('doctor')),
                ],
            ],
            $this->translatableFieldRules('name', false),
            $this->translatableFieldRules('specialization', false),
        );
    }
}
