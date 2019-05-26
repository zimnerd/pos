<?php

namespace App\Http\Controllers\Api\Transaction;

use App\DailyControl;
use App\DailySummary;
use App\DailyTransaction;
use App\Till;
use App\User;
use Illuminate\Support\Facades\Auth;

class TransactionController
{
    public $createdStatus = 201;

    /**
     * Create a transaction
     *
     * @param mixed $transaction
     * @return void
     */
    public function createTransaction($transaction)
    {
        $shop = $transaction["shop"];
        /**
         * @var Till $till
         */
        $till = $transaction["till"];
        /**
         * @var DailyTransaction[] $transaction
         */
        $lineItems = $transaction["transaction"];

        /**
         * @var User $user
         */
        $user = Auth::user();

        $count = 1;
        foreach ($lineItems as $item) {
            $dailyTransaction = new DailyTransaction();
            $dailyTransaction->BRNO = $shop['BrNo'];
            $dailyTransaction->TILLNO = $till['tillno'];
            $dailyTransaction->STYLE = $item['code'];
            $dailyTransaction->SIZES = $item['size'];
            $dailyTransaction->CLR = $item['colour'];

            $dailyTransaction->LINENO = $count;
            $dailyTransaction->DOCNO = $till['tillno'] . $till["InvNo"];
            $dailyTransaction->DOCTYPE = $transaction["type"];
            $dailyTransaction->SUP = $transaction["method"];
            $dailyTransaction->STYPE = $transaction["method"];
            $dailyTransaction->BDATE = \date("yyyy-MM-dd");
            $dailyTransaction->BTIME = time();

            $dailyTransaction->AMT = $item['total'];
            $dailyTransaction->VATAMT = $item['vat'];
            $dailyTransaction->QTY = $item['qty'];
            $dailyTransaction->SP = $item['subtotal'];
            $dailyTransaction->SPX = $item['subtotal'];
            $dailyTransaction->CP = $item['cost'];
            $dailyTransaction->DTYPE = '';
            $dailyTransaction->LPROMPT = "Enter";
            $dailyTransaction->DISCPERC = $item['disc'];
            $dailyTransaction->MARKUP = 0.00;
            $dailyTransaction->DISCAMT = $item['subtotal'] - $item['total'];
            $dailyTransaction->SMAN = "1";
            $dailyTransaction->UPDFLAG = 0;
            $dailyTransaction->LSLTYPE = $item['markdown'] ? 'M' : 'R';
            $dailyTransaction->APPNO = 0;
            $dailyTransaction->IBTDLNO = 0;
            $dailyTransaction->DLNO = 0;
            $dailyTransaction->UPDNO = 0;
            $dailyTransaction->UPDFLAG = 0;
            $dailyTransaction->INVREF = null;
            $dailyTransaction->PERIOD = $shop['Period'];
            $dailyTransaction->COMMENT = "";
            $dailyTransaction->RESCODE = null;
            $dailyTransaction->BUSER = $user->username;
            $dailyTransaction->AUSER = $item["auth"];
            $dailyTransaction->FWCNO = null;
            $dailyTransaction->SERIALNO = "";

            $count++;
            $dailyTransaction->save();
        }

        $summmary = new DailySummary();
        $summmary->BDATE = \date("yyyy-MM-dd");
        $summmary->BRNO = $shop['BrNo'];
        $summmary->BTYPE = $transaction["type"] === "INV" ? "DEP" : "PAY";
        $summmary->TRANNO = $till['tillno'] . $transaction["type"] === "INV" ? $till['DepNo'] : $shop['CredInvNo'];
        $summmary->TAXCODE = null;
        $summmary->VATAMT = $transaction["totals"]["vat"];
        $summmary->AMT = $transaction["totals"]["total"];
        $summmary->GLCODE = 0;
        $summmary->REMARKS = $transaction["type"] === "INV" ? "Sale" : "Credit";
        $summmary->COB = $transaction["method"];
        $summmary->STYPE = $transaction["method"];
        $summmary->UPDFLAG = 0;
        $summmary->DLNO = 0;
        $summmary->UPDNO = 0;
        $summmary->OTTYPE = $transaction["type"];
        $summmary->OTRANNO = $till['tillno'] . $till["InvNo"];
        $summmary->ODATE = \date("yyyy-MM-dd");
        $summmary->DEBTOR = $transaction["type"] === "INV" ? "Cash" : $transaction['debtor'];
        $summmary->BUSER = $user->username;
        $summmary->AUSER = $item["auth"];
        $summmary->PERIOD = $shop['Period'];
        $summmary->CCQNUM = "";
        $summmary->save();

        $control = new DailyControl();
        $control->docnum = $till['tillno'] . $till["InvNo"];
        $control->transtype = $transaction["type"];
        $control->save();

        return response()->json([], $this->createdStatus);
    }

}
