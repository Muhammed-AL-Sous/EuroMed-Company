<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOperationTypeRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', "unique:operation_types,code," . $this->route('operation_type')->id],
            'name' => ['required', 'string', 'max:255', "unique:operation_types,name," . $this->route('operation_type')->id],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
