<?php

namespace App\Models;

use App\Models\Operation\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'age',
        'date_of_birth',
        'gender',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
}
