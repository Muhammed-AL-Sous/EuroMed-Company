<?php

namespace App\Http\Middleware;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Cookie\CookieValuePrefix;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected function getTokenFromRequest($request)
    {
        $token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');

        if (! $token && $header = $request->header('X-XSRF-TOKEN')) {
            try {
                $token = CookieValuePrefix::remove(
                    $this->encrypter->decrypt($header, static::serialized())
                );
            } catch (DecryptException) {
                $token = urldecode($header);
            }
        }

        if (! $token && $cookie = $request->cookie('XSRF-TOKEN')) {
            $token = is_string($cookie) ? urldecode($cookie) : null;
        }

        return $token;
    }
}
