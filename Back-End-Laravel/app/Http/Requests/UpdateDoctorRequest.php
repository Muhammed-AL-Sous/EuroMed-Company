<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorRequest extends FormRequest
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
                'user_id' => ['prohibited'],
            ],

            $this->translatableFieldRules('name', false),
            $this->translatableFieldRules('specialization', false),
        );
    }
}
