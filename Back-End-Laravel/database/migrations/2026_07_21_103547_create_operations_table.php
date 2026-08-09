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
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique()->nullable();
            $table->date('operation_date');
            $table->foreignId('doctor_id')->constrained('doctors', 'id')->cascadeOnDelete();
            $table->foreignId('hospital_id')->constrained('hospitals', 'id')->cascadeOnDelete();
            $table->foreignId('operation_type_id')->constrained('operation_types', 'id')->cascadeOnDelete();
            $table->string('patient_access_code')->unique();
            $table->enum('side', ['Left', 'Right', 'Bilateral'])->nullable();
            $table->foreignId('patient_id')->constrained('patients', 'id')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
