<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/', function () {
    return view('welcome');
});


// CSRF Cookie route for SPA
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);


Route::get('/language/{locale}', function ($locale) {

    abort_unless(in_array($locale, ['ar', 'en']), 400);

    session()->put('locale', $locale);

    return back();
})->name('language');
