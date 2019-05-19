<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDailyTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('dlymtdtemp');
        Schema::create('dlymtdtemp', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string('BRNO');
            $table->string('DOCNO');
            $table->integer('TILLNO');
            $table->integer('LINENO');
            $table->string('DOCTYPE');
            $table->string('STYLE');
            $table->string('SIZES');
            $table->string('CLR');
            $table->string('SUP');
            $table->string('STYPE');
            $table->date('BDATE');
            $table->time('BTIME');
            $table->decimal('AMT');
            $table->decimal('VATAMT');
            $table->decimal('QTY');
            $table->decimal('SP');
            $table->decimal('SPX');
            $table->decimal('CP');
            $table->char('DTYPE');
            $table->string('LPROMPT');
            $table->decimal('DISCPERC');
            $table->decimal('MARKUP');
            $table->decimal('DISCAMT');
            $table->string('SMAN');
            $table->tinyInteger('UPDFLAG');
            $table->char('LSLTYPE');
            $table->integer('APPNO');
            $table->integer('IBTDLNO');
            $table->integer('DLNO');
            $table->integer('UPDNO');
            $table->string('INVREF');
            $table->integer('PERIOD');
            $table->string('COMMENT');
            $table->string('RESCODE');
            $table->string('BUSER');
            $table->string('AUSER');
            $table->string('FWCNO');
            $table->string('SERIALNO');
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
        Schema::dropIfExists('dlymtdtemp');
    }
}
