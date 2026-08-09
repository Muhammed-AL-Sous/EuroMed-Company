<?php

namespace App\Http\Requests\Concerns;

trait HasTranslatableRules
{
    /**
     * @return array<string, array<int, string>>
     */
    protected function translatableFieldRules(string $field, bool $required = true): array
    {
        $rule = $required ? 'required' : 'sometimes';

        return [
            $field => [$rule, 'array'],
            "{$field}.ar" => [$rule, 'string'],
            "{$field}.en" => [$rule, 'string'],
            "{$field}.ku" => [$rule, 'string'],
        ];
    }
}
