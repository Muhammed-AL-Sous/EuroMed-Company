<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | Single SPA origin — must match the browser URL (e.g. Vite dev server).
    | Set FRONTEND_URL in .env (e.g. http://localhost:5173).
    */
    'allowed_origins' => (function () {
        $origin = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return $origin !== '' ? [$origin] : ['http://localhost:5173'];
    })(),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // يجب أن تبقى true للسماح بمرور كوكي "تذكرني"
    'supports_credentials' => true,

];
