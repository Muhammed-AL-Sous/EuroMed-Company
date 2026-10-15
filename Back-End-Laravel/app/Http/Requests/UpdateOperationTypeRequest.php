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
            'name' => ['required', 'string', 'max:100', "unique:operation_types,name," . $this->route('operation_type')->id],
        ];
    }
}
