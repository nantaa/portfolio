<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes — Portfolio
|--------------------------------------------------------------------------
*/

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);
