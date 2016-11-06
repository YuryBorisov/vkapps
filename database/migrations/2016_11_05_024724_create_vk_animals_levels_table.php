<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVKAnimalsLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vk_animals_levels', function (Blueprint $table) {
            $table->tinyInteger('level_id', true, true);
            $table->tinyInteger('count_animals');
            $table->tinyInteger('spaces_count');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vk_animals_levels');
    }
}
