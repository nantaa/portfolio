<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BeaconController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes — Portfolio
|--------------------------------------------------------------------------
*/

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/beacon/clone', [BeaconController::class, 'cloneAlert'])->middleware('throttle:30,1');
