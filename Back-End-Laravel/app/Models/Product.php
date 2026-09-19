<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'manufacturer_id',
        'category_id',
        'subcategory_id',
        'price',
        'image_url',
        'medical_usage',
        'specifications',
        'available_sizes',
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

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'specifications' => 'array',
            'available_sizes' => 'array',
        ];
    }
    
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'subcategory_id');
    }
}
