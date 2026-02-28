<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('characters', function ($table) { $table->id(); $table->string('name')->unique(); $table->timestamps(); });
        Schema::create('skills', function ($table) { $table->id(); $table->string('name')->unique(); $table->timestamps(); });
        Schema::create('attributes', function ($table) { $table->id(); $table->foreignId('character_id')->constrained()->onDelete('cascade'); $table->string('name'); $table->integer('value'); $table->timestamps(); });
        Schema::create('character_skill', function ($table) { $table->foreignId('character_id')->constrained(); $table->foreignId('skill_id')->constrained(); $table->primary(['character_id', 'skill_id']); });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_tables');
    }
};
