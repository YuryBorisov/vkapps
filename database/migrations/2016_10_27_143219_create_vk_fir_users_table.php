<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVKFirUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vk_fir_users', function (Blueprint $table) {
            $table->integer('vk_id')->unique()->unsigned()->primary();
            $table->integer('count_firs')->unsigned()->default(0);
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
        Schema::dropIfExists('vk_fir_users');
    }
}
