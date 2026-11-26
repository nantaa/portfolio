<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class BeaconController extends Controller
{
    private const TRANSPARENT_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    /**
     * Record unauthorized mirror/clone hits and return a 1x1 transparent GIF.
     */
    public function cloneAlert(Request $request): Response
    {
        Log::warning('Unauthorized portfolio clone detected', [
            'claimed_host' => substr((string) $request->query('h', ''), 0, 120),
            'claimed_url' => substr((string) $request->query('u', ''), 0, 300),
            'referer' => substr((string) $request->query('r', ''), 0, 200),
            'remote_ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 200),
        ]);

        return response(base64_decode(self::TRANSPARENT_GIF), 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-store, private',
            'Cross-Origin-Resource-Policy' => 'cross-origin',
        ]);
    }
}

