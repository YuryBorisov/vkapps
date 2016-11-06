<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVKCaughtAnimalsUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vk_caught_animals_users', function (Blueprint $table) {
            $table->integer('vk_id')->unsigned()->references('vk_animals_users')->onDelete('cascade');
            $table->dateTime('create');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vk_caught_animals_users');
    }
}
