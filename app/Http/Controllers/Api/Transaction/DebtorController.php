<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Debtor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        $debtors = Debtor::all();
        if (count($debtors) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(['debtors' => $debtors], $this->successStatus);
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
        $debtor->balance = 0.0;
        $debtor->current = 0.0;

        $debtor->save();

        return response()->json(['debtor' => $debtor], $this->createdStatus);
    }

}
