<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasTranslatableRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreOperationTypeRequest extends FormRequest
{
    use HasTranslatableRules;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', "unique:operation_types,code"],
            'name' => ['required', 'string', 'max:255', "unique:operation_types,name"],
            'description' => ['nullable', 'string'],
        ];
    }
}
