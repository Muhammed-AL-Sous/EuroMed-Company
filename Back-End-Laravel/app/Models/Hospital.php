<?php

namespace App\Models;

use App\Models\Operation\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Hospital extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'city',
    ];

    public array $translatable = ['name', 'city'];

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
}
