<?php

use App\Http\Controllers\OperationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\OperationTypeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SubCategoryController;

Route::post('/patient-operation', [OperationController::class, 'findPatientOperation']);

Route::apiResource('hospitals', HospitalController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('subcategories', SubCategoryController::class)->only(['index', 'show']);
Route::apiResource('manufacturers', ManufacturerController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('operation-types', OperationTypeController::class)->only(['index', 'show']);
Route::apiResource('doctors', DoctorController::class)->only(['index', 'show']);
