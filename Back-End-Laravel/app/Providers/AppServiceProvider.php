<?php

namespace App\Providers;

use App\Models\Operation\Operation;
use App\Models\Operation\OperationItem;
use App\Models\Operation\OperationType;
use App\Observers\OperationObserver;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Authenticate::redirectUsing(fn () => null);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $frontendUrl = config('app.frontend_url');
            $email = $notifiable->getEmailForPasswordReset();

            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($email);
        });

        Route::bind('operation', fn (string $value) => Operation::findOrFail($value));
        Route::bind('operation_type', fn (string $value) => OperationType::findOrFail($value));
        Route::bind('item', fn (string $value) => OperationItem::findOrFail($value));

        Operation::observe(OperationObserver::class);
    }
}
