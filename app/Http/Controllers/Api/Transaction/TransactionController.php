<?php

namespace App\Http\Controllers\Api\Transaction;

use App\DailyControl;
use App\DailySummary;
use App\DailyTransaction;
use App\Http\Controllers\Controller;
use App\Till;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public $createdStatus = 201;

    /**
     * Create a transaction
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createTransaction(Request $request)
    {
        $this->validate($request, [
            'shop' => 'required',
            'till' => 'required',
            'transactions' => 'required',
            'totals' => 'required'
        ]);

        $transaction = $request->all();
        $shop = $transaction["shop"];
        /**
         * @var Till $till
         */
        $till = $transaction["till"];
        /**
         * @var DailyTransaction[] $transaction
         */
        $lineItems = $transaction["transactions"];
        $totals = $transaction["totals"];

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
            $dailyTransaction->BDATE = \date("Y-m-d");
            $dailyTransaction->BTIME = \date("H:i:s");

            $vat = $item['total'] * 15 / 100;
            $dailyTransaction->AMT = $item['total'];
            $dailyTransaction->VATAMT = $vat;
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
            $dailyTransaction->AUSER = $transaction["auth"];
            $dailyTransaction->FWCNO = null;
            $dailyTransaction->SERIALNO = "";

            $count++;
            $dailyTransaction->save();
        }

        $summmary = new DailySummary();
        $summmary->BDATE = \date("Y-m-d");
        $summmary->BRNO = $shop['BrNo'];
        $summmary->BTYPE = $transaction["type"] === "INV" ? "DEP" : "PAY";
        $summmary->TRANNO = $till['tillno'] . $transaction["type"] === "INV" ? $till['DepNo'] : $till['CredInvNo'];
        $summmary->TAXCODE = null;
        $summmary->VATAMT = $totals["vat"];
        $summmary->AMT = $totals["total"];
        $summmary->GLCODE = 0;
        $summmary->REMARKS = $transaction["type"] === "INV" ? "Sale" : "Credit";
        $summmary->COB = $transaction["method"];
        $summmary->STYPE = $transaction["method"];
        $summmary->UPDFLAG = 0;
        $summmary->TILLNO = $till['tillno'];
        $summmary->DLNO = 0;
        $summmary->UPDNO = 0;
        $summmary->OTTYPE = $transaction["type"];
        $summmary->OTRANNO = $till['tillno'] . $till["InvNo"];
        $summmary->ODATE = \date("Y-m-d");
        $summmary->DEBTOR = $transaction["type"] === "INV" ? "Cash" : $transaction['debtor'];
        $summmary->BUSER = $user->username;
        $summmary->AUSER = $transaction["auth"];
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
