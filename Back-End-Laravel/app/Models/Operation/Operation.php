<?php

namespace App\Models\Operation;

use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Operation extends Model
{
    protected $table = 'operations';

    protected $fillable = [
        'invoice_number',
        'operation_date',
        'doctor_id',
        'hospital_id',
        'operation_type_id',
        'patient_access_code',
        'side',
        'patient_id',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'operation_date' => 'date',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OperationItem::class);
    }

    public function operationType(): BelongsTo
    {
        return $this->belongsTo(OperationType::class, 'operation_type_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
