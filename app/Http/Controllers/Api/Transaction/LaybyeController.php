<?php

namespace App\Http\Controllers\Api\Transaction;

use App\DebtorTransaction;
use App\Http\Controllers\Controller;
use App\Laybye;
use App\LaybyeTransaction;
use App\Till;
use Illuminate\Http\Request;

class LaybyeController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;

    /**
     * Retrieves a lay-bye
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveLayBye($id)
    {
        $laybye = Laybye::query()
            ->where('no', $id)
            ->first();

        if (!$laybye) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['laybye' => $laybye], $this->successStatus);
    }

    /**
     * Pays the account of a lay-bye
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function payLayBye($id, Request $request)
    {
        $this->validate($request, [
            'till' => 'required',
            'shop' => 'required',
            'account' => 'required'
        ]);

        /**
         * @var Laybye $laybyeValues
         */
        $laybyeValues = $request->all();

        $laybye = Laybye::query()
            ->where('no', $id)
            ->first();

        if (!$laybye) {
            return response()->json([], $this->notFoundStatus);
        }

        $account = $laybyeValues['account'];

        $laybye->current = $account['current'];
        $laybye->balance = $account['balance'];
        $laybye->save();

        $till = $laybyeValues['till'];

        $tillInfo = Till::query()
            ->where('tillno', $till['tillno'])
            ->where('ColName', 'CrnNo')
            ->first();

        if (!$tillInfo) {
            return response()->json([], $this->notFoundStatus);
        }

        $docNo = (string) (((int) $tillInfo->ColValue) + 1);

        $tillInfo->ColValue = $docNo;
        $tillInfo->save();

        $docNo = '1' . $docNo;

        $shop = $laybyeValues['shop'];

        $laybyeTransaction = new LaybyeTransaction();

        $laybyeTransaction->invNo = $docNo;
        $laybyeTransaction->invAmt = $laybyeValues["tendered"];
        $laybyeTransaction->invDate = \date("Y-m-d");
        $laybyeTransaction->dueDate = \date("Y-m-d");
        $laybyeTransaction->type = "CRN";
        $laybyeTransaction->remarks = "Credit Payment";
        $laybyeTransaction->period = $shop['Period'];
        $laybyeTransaction->vatPer = $shop['Period'];
        $laybyeTransaction->crnref = $docNo;
        $laybyeTransaction->dts = new \DateTime();

        $laybyeTransaction->save();

        return response()->json(['laybye' => $laybye], $this->successStatus);
    }

}
