<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRequest extends FormRequest
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
                'user_id' => ['nullable', 'exists:users,id', 'unique:doctors,user_id'],
            ],
            $this->translatableFieldRules('name'),
            $this->translatableFieldRules('specialization'),
        );
    }
}
