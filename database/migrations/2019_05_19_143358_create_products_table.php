<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('descr');
            $table->string('unit');
            $table->integer('pack');
            $table->double('soh');
            $table->string('suply');
            $table->double('sp1');
            $table->double('sp2');
            $table->double('sp3');
            $table->double('sp4');
            $table->double('sp5');
            $table->double('sp6');
            $table->double('sp7');
            $table->double('sp8');
            $table->double('sp9');
            $table->double('sp10');
            $table->double('pprice');
            $table->char('promnow');
            $table->date('promoStart');
            $table->date('promoEnd');
            $table->double('cpe');
            $table->double('cpi');
            $table->double('acp');
            $table->string('link');
            $table->char('vati');
            $table->string('loc');
            $table->string('dept');
            $table->char('entpi');
            $table->date('idate');
            $table->double('rqty');
            $table->double('qytd');
            $table->double('valytd');
            $table->double('qmtd');
            $table->double('valmtd');
            $table->string('skunum');
            $table->date('mdate');
            $table->double('weight');
            $table->double('area');
            $table->string('agentCom');
            $table->char('noDisc');
            $table->char('altStock');
            $table->char('altItem');
            $table->string('blkQty');
            $table->string('blkSP');
            $table->double('LstPurPrice1');
            $table->double('LstPurPrice2');
            $table->double('LstPurPrice3');
            $table->double('blkSOH');
            $table->string('blkLoc');
            $table->double('minQty');
            $table->string('descr2');
            $table->string('type');
            $table->string('category');
            $table->string('extra1');
            $table->string('extra2');
            $table->string('extra3');
            $table->string('extra4');
            $table->string('extra5');
            $table->string('suplyCode');
            $table->string('itemType');
            $table->string('altPrinter');
            $table->double('salesVat');
            $table->double('purVat');
            $table->double('backOrder');
            $table->double('maxQty');
            $table->string('sizes');
            $table->string('clr');
            $table->string('groupCode');
            $table->string('itemCode');
            $table->string('seasonCode');
            $table->string('sourceCode');
            $table->string('classCode');
            $table->string('linkCode');
            $table->integer('active');
            $table->double('maxDisc');
            $table->date('grvDate');
            $table->string('imageLocation');
            $table->string('cellType');
            $table->string('class1');
            $table->string('class2');
            $table->string('class3');
            $table->string('chkstk');
            $table->integer('packawayf');
            $table->integer('sequence');
            $table->double('grvqty');
            $table->double('lbqoh');
            $table->double('appqoh');
            $table->dateTime('stkTakeDate');
            $table->string('choosePrice');
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
        Schema::dropIfExists('product');
    }
}
