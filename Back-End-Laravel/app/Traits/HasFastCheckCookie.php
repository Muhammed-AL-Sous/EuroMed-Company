<?php

namespace App\Traits;

trait HasFastCheckCookie
{
    public function getFastCheckCookie($value = 'true', $minutes = 525600)
    {
        $secure = app()->environment('production');

        return cookie('fast_check', $value, $minutes, '/', null, $secure, true, false, 'lax');
    }

    public function forgetFastCheckCookie()
    {
        $secure = app()->environment('production');

        return cookie('fast_check', '', -1, '/', null, $secure, true, false, 'lax');
    }
}
