<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\SkillController;

Route::apiResource('characters', CharacterController::class);
Route::apiResource('skills', SkillController::class);
