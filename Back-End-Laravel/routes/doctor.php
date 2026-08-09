<?php

use App\Http\Controllers\DoctorProfileController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:doctor'])
    ->prefix('doctor')
    ->group(function () {
        Route::get('/profile', [DoctorProfileController::class, 'show']);
        Route::post('/profile', [DoctorProfileController::class, 'store']);
        Route::put('/profile', [DoctorProfileController::class, 'update']);

        Route::middleware('doctor.profile')->group(function () {
            Route::get('/operations', [OperationController::class, 'doctorIndex']);
            Route::post('/operations', [OperationController::class, 'store']);
            Route::get('/operations/{operation}', [OperationController::class, 'show']);
            Route::post('/patients', [PatientController::class, 'store']);
        });
    });
