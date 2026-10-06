<?php

namespace App\Models;

use App\Models\Operation\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends Model
{
    protected $fillable = [
        'name',
        'city',
        'type'
    ];

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
}
