<?php

namespace App\Http\Requests\Concerns;

trait HasTranslatableRules
{
    /**
     * @return array<string, array<int, string>>
     */
    protected function translatableFieldRules(
        string $field,
        bool $required = true,
        ?string $requiredWith = null
    ): array {
        $parentRule = $required
            ? 'required'
            : ($requiredWith
                ? "required_with:{$requiredWith}"
                : 'sometimes');

        return [
            $field => [
                $parentRule,
                'array:ar,en',
            ],

            "{$field}.ar" => [
                "required_with:{$field}",
                'string',
                'max:255',
            ],

            "{$field}.en" => [
                "required_with:{$field}",
                'string',
                'max:255',
            ],
        ];
    }
}
