<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreHospitalRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge(
            $this->translatableFieldRules('name'),
            $this->translatableFieldRules('city', required: false),
        );
    }
}
