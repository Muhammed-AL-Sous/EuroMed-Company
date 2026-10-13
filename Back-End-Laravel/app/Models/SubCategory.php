<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class SubCategory extends Model
{
    protected $table = 'subcategories';

    protected $fillable = [
        'name',
        'description',
        'image_url',
    ];
    protected $appends = [
        'image_url',
    ];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) =>
            !empty($attributes['image_url'])
                ? asset('storage/' . $attributes['image_url'])
                : null,
        );
    }
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'subcategory_id');
    }
}
