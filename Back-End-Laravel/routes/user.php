<?php

use App\Http\Controllers\OperationController;
use Illuminate\Support\Facades\Route;

Route::post('/patient-operation', [OperationController::class, 'findPatientOperation']);
