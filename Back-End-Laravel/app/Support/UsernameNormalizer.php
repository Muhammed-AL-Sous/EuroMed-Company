<?php

namespace App\Support;

class UsernameNormalizer
{
    public static function normalize(string $username): string
    {
        return strtolower(
            preg_replace('/[.\s_-]+/u', '', trim($username))
        );
    }
}
