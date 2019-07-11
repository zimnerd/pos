<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaybyesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('lbmast');
        Schema::create('lbmast', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('no');
            $table->string('name')->nullable();
            $table->date('appDate');
            $table->decimal('balance');
            $table->decimal('current');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lbmast');
    }
}
