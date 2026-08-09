<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorProfileRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user()?->hasRole('doctor') ?? false;
    }

    public function rules(): array
    {
        return array_merge(
            $this->translatableFieldRules('name', false),
            $this->translatableFieldRules('specialization', false),
        );
    }
}
