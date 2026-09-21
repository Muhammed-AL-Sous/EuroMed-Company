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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Spatie\Browsershot\Browsershot;

Route::post('/operations/pdf', function (Request $request) {
    $request->validate([
        'html' => 'required|string',
        'css' => 'nullable|string',
    ]);

    $html = $request->input('html');
    $css = $request->input('css', '');

    /*
    |--------------------------------------------------------------------------
    | Convert local Laravel storage images to Base64
    |--------------------------------------------------------------------------
    */

    $html = preg_replace_callback(
        '/<img([^>]+)src=["\']([^"\']+)["\']([^>]*)>/i',
        function ($matches) {

            $before = $matches[1];
            $src = $matches[2];
            $after = $matches[3];

            /*
            | Example:
            | http://localhost:8000/storage/products/tibial_base.png
            |
            | becomes:
            | storage/products/tibial_base.png
            */

            $path = parse_url($src, PHP_URL_PATH);

            if (!$path) {
                return $matches[0];
            }

            $path = ltrim($path, '/');

            if (!str_starts_with($path, 'storage/')) {
                return $matches[0];
            }

            /*
            | storage/products/file.png
            | ->
            | storage/app/public/products/file.png
            */

            $relativePath = substr($path, strlen('storage/'));

            $filePath = storage_path(
                'app/public/' . $relativePath
            );

            if (!File::exists($filePath)) {
                return $matches[0];
            }

            $mimeType = File::mimeType($filePath);
            $base64 = base64_encode(
                File::get($filePath)
            );

            $dataUri = "data:{$mimeType};base64,{$base64}";

            return '<img'
                . $before
                . 'src="' . $dataUri . '"'
                . $after
                . '>';
        },
        $html
    );

    /*
    |--------------------------------------------------------------------------
    | Full HTML document
    |--------------------------------------------------------------------------
    */

    $fullHtml = "
        <!DOCTYPE html>
        <html lang='en' dir='ltr'>
        <head>
            <meta charset='UTF-8'>

            <style>
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: Arial, sans-serif;
                }

                {$css}
            </style>
        </head>

        <body>
            {$html}
        </body>
        </html>
    ";

    /*
    |--------------------------------------------------------------------------
    | Generate PDF
    |--------------------------------------------------------------------------
    */

    $pdf = Browsershot::html($fullHtml)
        ->format('A4')
        ->margins(10, 10, 10, 10)
        ->showBackground()
        ->setOption('waitUntil', 'domcontentloaded')
        ->pdf();

    return response($pdf, 200, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'attachment; filename="operation-certificate.pdf"',
    ]);
});


Route::post('/patient-operation', [OperationController::class, 'findPatientOperation']);

Route::apiResource('hospitals', HospitalController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('subcategories', SubCategoryController::class)->only(['index', 'show']);
Route::apiResource('manufacturers', ManufacturerController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('operation-types', OperationTypeController::class)->only(['index', 'show']);
Route::apiResource('doctors', DoctorController::class)->only(['index', 'show']);
