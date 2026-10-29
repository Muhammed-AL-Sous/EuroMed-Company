<?php

namespace App\Models\Operation;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OperationType extends Model
{
    protected $table = 'operation_types';

    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class, 'operation_type_id');
    }
}
