<?php

use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationTypeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SubCategoryController;
use Illuminate\Support\Facades\Route;

Route::post('/patient-operation', [OperationController::class, 'findPatientOperation']);

Route::get('/operationTypes', [OperationTypeController::class, 'index']);

Route::get('/manufacturers-brands', [ManufacturerController::class, 'index']);

Route::get('/getProductsBySubCategory/{subCategoryId}', [ProductController::class, 'getProductsBySubCategory']);

Route::get('/getSubCategories', [SubCategoryController::class, 'getSubCategories']);

Route::get('/getProducts', [ProductController::class, 'getProducts']);
