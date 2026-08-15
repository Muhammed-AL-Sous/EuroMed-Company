<?php

use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationTypeController;
use Illuminate\Support\Facades\Route;

Route::post('/patient-operation', [OperationController::class, 'findPatientOperation']);

Route::get('/operationTypes', [OperationTypeController::class, 'index']);

Route::get('/manufacturers-brands', [ManufacturerController::class, 'index']);
