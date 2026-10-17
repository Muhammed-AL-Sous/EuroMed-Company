<?php

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationItemController;

Route::middleware('auth:sanctum')->group(function () {

    // Current User
    Route::get(
        'users/currentUser',
        [UserController::class, 'showCurrentUser']
    );

    // Manage Users Permission
    Route::middleware('permission:manage users')->group(function () {

        Route::get(
            'users/manage-users',
            [UserController::class, 'manageUsers']
        );
    });

    // Admin Only
    Route::middleware('role:admin')->group(function () {

        // Users
        Route::apiResource(
            'users',
            UserController::class
        );

        // Doctors
        Route::apiResource(
            'doctors',
            DoctorController::class
        )->only([
            'index',
            'store',
            'show',
            'update',
        ]);
    });

    // Admin And Data Entry
    Route::middleware('role:admin|data_entry')->group(function () {

        // Patients
        Route::apiResource(
            'patients',
            PatientController::class
        )->only([
            'index',
            'show',
        ]);

        // Operations
        Route::get(
            'operations',
            [OperationController::class, 'index']
        );

        Route::post(
            'operations',
            [OperationController::class, 'store']
        );

        Route::get(
            'operations/{operation}',
            [OperationController::class, 'show']
        );

        Route::match(
            ['put', 'patch'],
            'operations/{operation}',
            [OperationController::class, 'update']
        );

        // Operation Items
        Route::get(
            'operations/{operation}/items',
            [OperationItemController::class, 'index']
        );

        Route::post(
            'operations/{operation}/items',
            [OperationItemController::class, 'store']
        );

        Route::get(
            'operation-items/{item}',
            [OperationItemController::class, 'show']
        );

        Route::match(
            ['put', 'patch'],
            'operation-items/{item}',
            [OperationItemController::class, 'update']
        );
    });
});
