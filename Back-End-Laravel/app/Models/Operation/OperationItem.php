<?php

namespace App\Models\Operation;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OperationItem extends Model
{
    protected $table = 'operation_items';

    protected $fillable = [
        'operation_id',
        'product_id',
        'quantity'
    ];

    public function operation(): BelongsTo
    {
        return $this->belongsTo(Operation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
