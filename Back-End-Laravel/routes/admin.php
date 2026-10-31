<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationExcelController;
use App\Http\Controllers\OperationItemController;

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard

    Route::get(
        '/dashboard/overview',
        [DashboardController::class, 'overview']
    );

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
            'destroy'
        ]);
    });

    // Admin And Staff
    Route::middleware('role:admin|staff')->group(function () {

        // Patients
        Route::apiResource(
            'patients',
            PatientController::class
        );

        // Operations
        Route::get(
            'operations',
            [OperationController::class, 'index']
        );

        Route::get(
            '/operations/import-template',
            [OperationExcelController::class, 'template']
        );

        Route::post(
            '/operations/import',
            [OperationExcelController::class, 'import']
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
