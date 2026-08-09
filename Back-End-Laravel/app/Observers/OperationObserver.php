<?php

namespace App\Observers;

use App\Models\Operation\Operation;
use Illuminate\Support\Str;

class OperationObserver
{
    public function creating(Operation $operation): void
    {
        if (empty($operation->invoice_number)) {
            $operation->invoice_number = 'Operation-'.Str::uuid();
        }
    }
}
