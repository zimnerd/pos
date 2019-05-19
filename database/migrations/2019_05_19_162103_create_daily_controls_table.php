<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDailyControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('dlyposcb');
        Schema::create('dlyposcb', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('BDATE');
            $table->string('BRNO');
            $table->string('BTYPE');
            $table->integer('TRANNO');
            $table->smallInteger('TAXCODE');
            $table->decimal('VATAMT');
            $table->decimal('AMT');
            $table->integer('GLCODE');
            $table->string('REMARKS');
            $table->string('COB');
            $table->string('STYPE');
            $table->char('UPDFLAG');
            $table->smallInteger('TILLNO');
            $table->integer('DLNO');
            $table->integer('UPDNO');
            $table->string('OTTYPE');
            $table->string('OTRANNO');
            $table->date('ODATE');
            $table->string('DEBTOR');
            $table->string('BUSER');
            $table->string('AUSER');
            $table->integer('PERIOD');
            $table->string('CCQNUM');
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
        Schema::dropIfExists('dlyposcb');
    }
}
