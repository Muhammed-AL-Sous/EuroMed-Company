<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorProfileRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user()?->hasRole('doctor') ?? false;
    }

    public function rules(): array
    {
        return array_merge(
            $this->translatableFieldRules('name'),
            $this->translatableFieldRules('specialization'),
        );
    }
}
