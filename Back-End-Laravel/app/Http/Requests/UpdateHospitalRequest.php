<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHospitalRequest extends FormRequest
{

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'string', 'max:255', "unique:hospitals,code," . $this->route('hospital')->id],
            'name' => ['sometimes', 'string', 'max:255', "unique:hospitals,name," . $this->route('hospital')->id],
            'city' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:Government,Private'],
        ];
    }
}
