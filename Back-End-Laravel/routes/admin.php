<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationItemController;
use App\Http\Controllers\OperationTypeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware('permission:manage users')->group(function () {
        Route::get('users/manage-users', [UserController::class, 'manageUsers']);
    });

    Route::get('users/currentUser', [UserController::class, 'showCurrentUser']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    Route::apiResource('hospitals', HospitalController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('subcategories', SubCategoryController::class)->only(['index', 'show']);
    Route::apiResource('manufacturers', ManufacturerController::class)->only(['index', 'show']);
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);
    Route::apiResource('operation-types', OperationTypeController::class)->only(['index', 'show']);
    Route::apiResource('patients', PatientController::class)->only(['index', 'show']);
    Route::apiResource('doctors', DoctorController::class)->only(['index', 'show']);

    Route::middleware('role:admin|data_entry')->group(function () {
        Route::apiResource('hospitals', HospitalController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('subcategories', SubCategoryController::class)->except(['index', 'show']);
        Route::apiResource('manufacturers', ManufacturerController::class)->except(['index', 'show']);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('operation-types', OperationTypeController::class)->except(['index', 'show']);
        Route::apiResource('patients', PatientController::class)->except(['index', 'show']);
        Route::apiResource('doctors', DoctorController::class)->except(['index', 'show']);
        Route::apiResource('operations', OperationController::class);
        Route::apiResource('operations.items', OperationItemController::class)->shallow();
    });
});
