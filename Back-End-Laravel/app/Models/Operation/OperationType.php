<?php

namespace App\Models\Operation;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class OperationType extends Model
{
    use HasTranslations;

    protected $table = 'operation_types';

    protected $fillable = [
        'name',
    ];

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class, 'operation_type_id');
    }
}
