<?php

namespace App\Models;

use App\Models\Operation\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Doctor extends Model
{
    use HasTranslations;

    protected $fillable = [
        'user_id',
        'name',
        'specialization',
        'profile_completed_at',
    ];

    public array $translatable = ['name', 'specialization'];

    protected function casts(): array
    {
        return [
            'profile_completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
}
