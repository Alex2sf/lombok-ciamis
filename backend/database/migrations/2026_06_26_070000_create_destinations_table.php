<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('label');
            $table->string('region');
            $table->text('hero_tagline');
            $table->string('accent_color');
            $table->string('accent_text_color');
            $table->text('wa_message');
            $table->json('spots')->nullable();
            $table->json('itinerary')->nullable();
            $table->json('packages')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
