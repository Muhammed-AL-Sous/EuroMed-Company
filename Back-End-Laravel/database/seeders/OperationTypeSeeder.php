<?php

namespace Database\Seeders;

use App\Models\Operation\OperationType;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Seeder;

class OperationTypeSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path(
            'seeders/data/operation_types.json'
        );

        $OperationTypes = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        foreach ($OperationTypes as $OperationType) {
            OperationType::updateOrCreate(
                ['code' => $OperationType['code']],
                [
                    'name' => $OperationType['name'],
                    'description' => $OperationType['description'],
                ]
            );
        }
    }
}
