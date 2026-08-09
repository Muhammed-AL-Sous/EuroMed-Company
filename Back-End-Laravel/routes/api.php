<?php

use App\Http\Controllers\HealthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/doctor.php';
require __DIR__ . '/user.php';
