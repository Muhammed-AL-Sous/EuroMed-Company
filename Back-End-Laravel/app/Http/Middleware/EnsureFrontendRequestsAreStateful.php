<?php

namespace App\Http\Middleware;

use Illuminate\Support\Str;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as SanctumEnsureStateful;
use Laravel\Sanctum\Sanctum;

class EnsureFrontendRequestsAreStateful extends SanctumEnsureStateful
{
    public static function fromFrontend($request)
    {
        if (parent::fromFrontend($request)) {
            return true;
        }

        $stateful = array_filter(config('sanctum.stateful', []));
        $httpHost = $request->getHttpHost();
        $host = $request->getHost();

        foreach ($stateful as $domain) {
            $domain = $domain === Sanctum::$currentRequestHostPlaceholder ? $httpHost : trim((string) $domain);

            if ($domain === '') {
                continue;
            }

            if (strcasecmp($httpHost, $domain) === 0) {
                return true;
            }

            $domainHost = Str::before($domain, ':');

            if (strcasecmp($host, $domainHost) === 0) {
                return true;
            }
        }

        return false;
    }
}
