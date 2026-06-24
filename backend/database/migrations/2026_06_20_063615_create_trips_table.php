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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('destinasi');
            $table->text('deskripsi')->nullable();
            $table->longText('fasilitas')->nullable();
            $table->string('thumbnail')->nullable();
            $table->date('tanggal_berangkat')->nullable();
            $table->string('status')->default('Aktif'); // Aktif, Penuh, Selesai
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
