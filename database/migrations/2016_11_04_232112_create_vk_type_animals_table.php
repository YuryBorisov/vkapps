<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVKTypeAnimalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vk_type_animals', function (Blueprint $table) {
            $table->tinyInteger('id', true, true);
            $table->string('type', 50);
            $table->string('name', 8);
            $table->string('path_map');
            $table->string('path_avatar');
            $table->string('avatar_zv');
            $table->tinyInteger('step');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vk_type_animals');
    }
}
