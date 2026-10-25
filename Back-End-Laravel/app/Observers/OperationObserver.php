<?php

namespace App\Observers;

use App\Models\Operation\Operation;

class OperationObserver
{
    public function created(Operation $operation): void
    {
        if (empty($operation->invoice_number)) {
            $operation->invoice_number = 'Operation-' . $operation->id;

            $operation->saveQuietly();
        }
    }
}
