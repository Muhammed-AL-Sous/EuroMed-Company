<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacturer extends Model
{
    protected $fillable = [
        'name',
        'origin',
        "logo_text",
        "description",
        "website",
        "is_active",
        "product_count"
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
