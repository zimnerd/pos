<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Debtor;
use App\DebtorTransaction;
use App\Http\Controllers\Controller;
use App\Till;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class DebtorController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;

    /**
     * Retrieves all debtors
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveDebtors()
    {
        $type = Input::get('stype');
        $debtors = Debtor::query()->where('stype', $type)->get();

        $count = Debtor::all()->count();

        if (count($debtors) === 0) {
            return response()->json(["next" => $count + 1], $this->notFoundStatus);
        }

        return response()->json(['debtors' => $debtors, "next" => $count + 1], $this->successStatus);
    }

    /**
     * Retrieves a debtor
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveDebtor($id)
    {
        $type = Input::get('stype');
        $debtor = Debtor::query()
            ->where('stype', $type)
            ->where('no', $id)
            ->first();

        if (!$debtor) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['debtor' => $debtor], $this->successStatus);
    }

    /**
     * Pays the account of a debtor
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function payDebtor($id, Request $request)
    {
        $this->validate($request, [
            'till' => 'required',
            'shop' => 'required',
            'account' => 'required'
        ]);

        /**
         * @var Debtor $debtorValues
         */
        $debtorValues = $request->all();

        $debtor = Debtor::query()
            ->where('no', $id)
            ->first();

        if (!$debtor) {
            return response()->json([], $this->notFoundStatus);
        }

        $account = $debtorValues['account'];

        $debtor->current = $account['current'];
        $debtor->balance = $account['balance'];
        $debtor->save();

        $till = $debtorValues['till'];

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

        $shop = $debtorValues['shop'];

        $debtorTransaction = new DebtorTransaction();

        $debtorTransaction->invNo = $docNo;
        $debtorTransaction->invAmt = $debtorValues["tendered"];
        $debtorTransaction->invDate = \date("Y-m-d");
        $debtorTransaction->dueDate = \date("Y-m-d");
        $debtorTransaction->type = "CRN";
        $debtorTransaction->remarks = "Credit Payment";
        $debtorTransaction->period = $shop['Period'];
        $debtorTransaction->vatPer = $shop['Period'];
        $debtorTransaction->crnref = $docNo;
        $debtorTransaction->dts = new \DateTime();

        $debtorTransaction->save();

        return response()->json(['debtor' => $debtor], $this->successStatus);
    }

    /**
     * Saves a debtor
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveDebtor(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'cell' => 'required',
            'email' => 'required',
            'type' => 'required'
        ]);

        /**
         * @var Debtor $debtor
         */
        $debtor = $request->all();
        switch ($debtor['type']) {
            case "Credit":
                $debtor['trantype'] = "INV";
                $debtor['stype'] = "Credit";
                break;
            case "Staff":
                $debtor['trantype'] = "INV";
                $debtor['stype'] = "Staff";
                break;
            case "DCS":
                $debtor['trantype'] = "DCS";
                $debtor['stype'] = "DCS";
                break;
        }

        $debtor = new Debtor($debtor);
        $debtor->paytype = "Cash";
        $debtor->appDate = \date('Y-m-d');

        if ($debtor->balance === null) {
            $debtor->balance = 0.0;
            $debtor->current = 0.0;
        }

        $debtor->save();

        return response()->json(['debtor' => $debtor], $this->createdStatus);
    }

}
