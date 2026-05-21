<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * Return all projects ordered by sort_order.
     */
    public function index(): JsonResponse
    {
        $projects = Project::orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'data' => $projects,
        ]);
    }
}
