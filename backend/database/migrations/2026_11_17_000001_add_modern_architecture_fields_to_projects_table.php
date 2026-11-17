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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('demo_type')->default('interactive')->after('link');
            $table->string('demo_url')->nullable()->after('demo_type');
            $table->string('badge_label', 16)->nullable()->after('demo_url');
            $table->text('tech_stack')->nullable()->after('badge_label');
            $table->string('blueprint_theme')->nullable()->after('tech_stack');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'demo_type',
                'demo_url',
                'badge_label',
                'tech_stack',
                'blueprint_theme',
            ]);
        });
    }
};

