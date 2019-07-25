<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Airtime;
use App\Colours;
use App\DailyControl;
use App\DailySummary;
use App\DailyTransaction;
use App\Debtor;
use App\DebtorTransaction;
use App\Handset;
use App\Http\Controllers\Controller;
use App\Laybye;
use App\LaybyeTransaction;
use App\Models\Transaction\StockTransaction;
use App\Person;
use App\Product;
use App\Refund;
use App\Stock;
use App\Till;
use App\User;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class TransactionController extends Controller
{
    public $successStatus = 200;
    public $createdStatus = 201;
    public $notFoundStatus = 404;
    public $validationStatus = 422;
    public $errorStatus = 500;

    /**
     * Create a transaction
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createTransaction(Request $request)
    {
        $transaction = $request->all();
        if ($transaction["type"] === "L/B") {
            $this->validate($request, [
                'shop' => 'required',
                'till' => 'required',
                'transactions' => 'required',
                'totals' => 'required',
                'person.name' => 'required',
                'person.email' => 'nullable | email',
                'person.cell' => 'required | max:10 | min:10',
                'person.idNo' => 'required'
            ]);
        } else {
            $this->validate($request, [
                'shop' => 'required',
                'till' => 'required',
                'transactions' => 'required',
                'totals' => 'required',
                'person.email' => 'nullable | email',
                'person.cell' => 'nullable | max:10 | min:10'
            ]);
        }

        try {
            DB::beginTransaction();

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

            $docNo = $till['tillno'] . $till["InvNo"];
            $refund = false;
            switch ($transaction["type"]) {
                case "INV":
                    $docNo = $till['tillno'] . $till["InvNo"];
                    if (isset($transaction['debtor'])) {
                        $debtorNo = $transaction['debtor']['no'];
                    }
                    break;
                case "CRN":
                    $docNo = $till['tillno'] . $till["CrnNo"];
                    $refund = true;
                    if (isset($transaction['debtor'])) {
                        $debtorNo = $transaction['debtor']['no'];
                        $laybyeNo = $debtorNo;
                    }
                    break;
                case "L/B":
                    $docNo = $till['tillno'] . $till["LbNo"];
                    $depNo = $till['tillno'] . $till["DepNo"];
                    $laybyeNo = $docNo;
                    break;
                case "LBC":
                    $docNo = $till['tillno'] . $till["CrnNo"];
                    if (isset($transaction['debtor'])) {
                        $laybyeNo = $transaction['debtor']['no'];
                        $debtorNo = $transaction['debtor']['no'];
                        $itemDebtor = $transaction['debtor'];
                    }
                    break;
            }

            $count = 1;
            foreach ($lineItems as $item) {
                if (!isset($item['markdown'])) {
                    $item['markdown'] = false;
                }
                if (!isset($item['combo'])) {
                    $item['combo'] = false;
                }
                if (!isset($item['isStaff'])) {
                    $item['isStaff'] = false;
                }

                $dailyTransaction = new DailyTransaction();
                $dailyTransaction->BRNO = $shop['BrNo'];
                $dailyTransaction->TILLNO = $till['tillno'];
                $dailyTransaction->STYLE = $item['code'];
                $dailyTransaction->SIZES = $item['size'];
                $dailyTransaction->CLR = $item['clrcode'];

                if (isset($item['serialno'])) {
                    $dailyTransaction->SERIALNO = $item['serialno'];
                } else {
                    $dailyTransaction->SERIALNO = '';
                }

                $dailyTransaction->LINENO = $count;
                $dailyTransaction->DOCNO = $docNo;
                $dailyTransaction->DOCTYPE = $transaction["type"];
                $dailyTransaction->SUP = $transaction["method"];

                if (isset($transaction['stype'])) {
                    if ($transaction['stype'] === "Refund") {
                        $refund = true;
                    }

                    $dailyTransaction->STYPE = $transaction['stype'];
                } else {
                    $dailyTransaction->STYPE = $transaction["method"];
                }

                $dailyTransaction->BDATE = \date("Y-m-d");
                $dailyTransaction->BTIME = \date("H:i:s");

                $vat = $item['total'] - ($item['total'] / 115 * 100);
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

                if ($item['markdown'] === true) {
                    $saleType = 'M';
                } elseif ($item['combo'] === true) {
                    $saleType = 'D';
                } elseif ($item['isStaff'] === true) {
                    $saleType = 'S';
                } else {
                    $saleType = 'R';
                }

                $dailyTransaction->LSLTYPE = $saleType;

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

                if (isset($item['rescode'])) {
                    $dailyTransaction->RESCODE = $item['rescode'];
                }

                if (isset($item['comments'])) {
                    $dailyTransaction->COMMENT = $item['comments'];
                }

                $count++;
                $dailyTransaction->save();

                $colour = Colours::query()
                    ->where("code", $item['clrcode'])
                    ->first();

                /**
                 * @var Stock $stock
                 */
                $stock = Stock::query()
                    ->where("STYLE", $item['code'])
                    ->where("SIZES", $item['size'])
                    ->where("CLR", $colour->code)
                    ->first();

                if ($refund) {
                    $stock->QOH = $stock->QOH + 1;
                } else {
                    $stock->QOH = $stock->QOH - 1;
                }

                $stock->save();

                if (isset($item['serialno'])) {

                    $queryBuilder = Handset::query();
                    $queryBuilder->where('code', $dailyTransaction->STYLE)
                        ->where('serialno', $dailyTransaction->SERIALNO);
                    /**
                     * @var Handset $serialObject
                     */
                    $serialObject = $queryBuilder->first();

                    if (!$serialObject) {
                        $queryBuilder = Airtime::query();
                        $queryBuilder->where('code', $dailyTransaction->STYLE)
                            ->where('serialno', $dailyTransaction->SERIALNO);
                        /**
                         * @var Airtime $serialObject
                         */
                        $serialObject = $queryBuilder->first();
                    }

                    $serialObject->solddate = new \DateTime();
                    $serialObject->save();
                }

                $stockTransaction = new StockTransaction();
                $stockTransaction->STYLE = $item['code'];
                $stockTransaction->SIZES = $item['size'];
                $stockTransaction->CLR = $item['clrcode'];
                $stockTransaction->BRNO = $shop['BrNo'];
                $stockTransaction->CSTREF = null;
                $stockTransaction->BDATE = \date("Y-m-d");
                $stockTransaction->REF = $docNo;
                $stockTransaction->QOH = $stock->QOH;
                $stockTransaction->QTY = $item['qty'];
                $stockTransaction->SP = $item['subtotal'];
                $stockTransaction->CP = $item['cost'];
                $stockTransaction->DLNO = "0";
                $stockTransaction->ASSNO = 0;
                $stockTransaction->LBTAKEN = "";
                $stockTransaction->SMAN = "";
                $stockTransaction->SLTYPE = $saleType;
                $stockTransaction->BTYPE = $transaction["type"];
                $stockTransaction->VATAMT = $vat;
                $stockTransaction->DISCAMT = $item['subtotal'] - $item['total'];
                $stockTransaction->AMT = $item['total'];

                $stockTransaction->save();
            }

            if (isset($transaction["stype"])) {
                $stype = $transaction["stype"];
            } else {
                $stype = "";
            }

            if (!(($transaction["type"] === "LBC" && $transaction['tendered'] == 0)
                || ($transaction["type"] === "CRN" && $stype === "Exchng"))) {
                $summmary = new DailySummary();
                if ($transaction["type"] !== "CRN" && $transaction["type"] !== "LBC") {
                    $summmary->BTYPE = "DEP";
                    $summmary->TRANNO = $till['tillno'].$till["DepNo"];
                } else {
                    $summmary->BTYPE = "PAY";
                    $summmary->TRANNO = $till['tillno'].$till["PayNo"];
                }

                $summmary->BDATE = \date("Y-m-d");
                $summmary->BRNO = $shop['BrNo'];
                $summmary->TAXCODE = null;
                $summmary->VATAMT = $totals["vat"];
                $summmary->AMT = $transaction["type"] === "LBC" ? $transaction['tendered'] : $totals["total"];
                $summmary->GLCODE = 0;
                $summmary->REMARKS = "Sale";
                $summmary->COB = $transaction["method"];

                if (isset($transaction['stype'])) {
                    $summmary->STYPE = $transaction['stype'];
                } else {
                    $summmary->STYPE = $transaction["method"];
                }

                $summmary->UPDFLAG = 0;
                $summmary->TILLNO = $till['tillno'];
                $summmary->DLNO = 0;
                $summmary->UPDNO = 0;
                $summmary->OTTYPE = $transaction["type"];
                $summmary->OTRANNO = $docNo;
                $summmary->ODATE = \date("Y-m-d");

                if (isset($debtorNo)) {
                    $summmary->DEBTOR = $debtorNo;
                } else {
                    $summmary->DEBTOR = "Cash";
                }

                $summmary->BUSER = $user->username;
                $summmary->AUSER = $transaction["auth"];
                $summmary->PERIOD = $shop['Period'];
                $summmary->CCQNUM = "";

                if (isset($laybyeNo) && isset($depNo)) {
                    $summmary->TRANNO = $depNo;
                    $summmary->VATAMT = 0;
                    $summmary->AMT = $transaction['tendered'];
                }

                $summmary->save();
            }

            if (!($transaction["type"] === "L/B" && $transaction['stype'] === "Refund")) {
                $control = new DailyControl();

                $control->docnum = $docNo;
                $control->transtype = $transaction["type"];

                $control->save();
            }

            $request = new Request();
            if (!isset($transaction['person'])) {
                $request->replace([]);
            } else {
                /**
                 * @var mixed $person
                 */
                $person = $transaction['person'];
                $request->replace($person);
            }

            $this->savePerson($request, $docNo, $transaction["type"]);

            if (isset($laybyeNo)) {
                if ($transaction["type"] === "LBC" || $transaction["type"] === "CRN") {
                    $laybye = Laybye::query()->where("no", $laybyeNo)->first();
                    if ($transaction["tendered"] > 0) {
                        $depAmt = 0;
                        $laybye->balance = $laybye->balance - ($totals["total"] - $transaction["tendered"]);
                        $laybye->current = $laybye->current - ($totals["total"] - $transaction["tendered"]);
                    } else {
                        $depAmt = $laybye->balance;
                        $laybye->balance -= $laybye->balance;
                        $laybye->current -= $laybye->current;
                    }
                } else {
                    $depAmt = 0;
                    $laybye = new Laybye();
                    $laybye->balance = $totals["total"] - $transaction["tendered"];
                    $laybye->current = $totals["total"] - $transaction["tendered"];
                }

                if ($transaction["type"] === "CRN") {
                    unset($debtorNo);
                }

                $laybye->no = $laybyeNo;

                if (isset($person)) {
                    $laybye->name = $person["name"];
                    $laybye->idNo = $person["idNo"];
                    $laybye->cell = $person["cell"];
                    $laybye->email = $person["email"];
                    $laybye->line1 = $person["line1"];
                    $laybye->line2 = $person["line2"];
                    $laybye->line3 = $person["line3"];
                }

                $laybye->appDate = \date("Y-m-d");

                $laybye->save();

                if ($transaction['stype'] !== "Refund") {
                    $laybyeTransaction = new LaybyeTransaction();

                    $laybyeTransaction->accNo = $laybyeNo;
                    $laybyeTransaction->invNo = $docNo;
                    $laybyeTransaction->invDate = \date("Y-m-d");
                    $laybyeTransaction->dueDate = \date("Y-m-d");
                    $laybyeTransaction->invAmt = $totals["total"];
                    $laybyeTransaction->type = $transaction["type"];
                    $laybyeTransaction->remarks = "Laybye";
                    $laybyeTransaction->period = $shop['Period'];
                    $laybyeTransaction->vatPer = $shop['Period'];
                    $laybyeTransaction->crnref = $docNo;
                    $laybyeTransaction->dts = new \DateTime();

                    $laybyeTransaction->save();
                }

                if ($transaction["tendered"] != 0) {
                    $depositTransaction = new LaybyeTransaction();

                    $depositTransaction->accNo = $laybyeNo;
                    $depositTransaction->invNo = isset($depNo) ? $depNo : $docNo;
                    $depositTransaction->invDate = \date("Y-m-d");
                    $depositTransaction->dueDate = \date("Y-m-d");
                    $depositTransaction->invAmt = $transaction["tendered"];
                    $depositTransaction->type = $transaction['stype'] === "Refund" ? "PAY" : "DEP";
                    $depositTransaction->remarks = $transaction['stype'] === "Refund" ? "Refund" : "Deposit";
                    $depositTransaction->period = $shop['Period'];
                    $depositTransaction->vatPer = $shop['Period'];
                    $depositTransaction->crnref = $docNo;
                    $depositTransaction->dts = new \DateTime();

                    $depositTransaction->save();
                    unset($itemDebtor);
                    unset($debtorNo);
                } else {
                    $depositTransaction = new LaybyeTransaction();

                    $depositTransaction->accNo = $laybyeNo;
                    $depositTransaction->invNo = isset($depNo) ? $depNo : $docNo;
                    $depositTransaction->invDate = \date("Y-m-d");
                    $depositTransaction->dueDate = \date("Y-m-d");
                    $depositTransaction->invAmt = $depAmt;
                    $depositTransaction->type = $transaction['stype'] === "Refund" ? "PAY" : "DEP";
                    $depositTransaction->remarks = $transaction['stype'] === "Refund" ? "Refund" : "Deposit";
                    $depositTransaction->period = $shop['Period'];
                    $depositTransaction->vatPer = $shop['Period'];
                    $depositTransaction->crnref = $docNo;
                    $depositTransaction->dts = new \DateTime();

                    $depositTransaction->save();
                }

                if (isset($itemDebtor)) {
                    $debtorTransaction = new DebtorTransaction();

                    $debtorTransaction->accNo = "LB".$itemDebtor['no'];
                    $debtorTransaction->invNo = $docNo;
                    $debtorTransaction->invAmt = (float) number_format((float) $itemDebtor["balance"], 2, '.', '') * -1;
                    $debtorTransaction->invDate = \date("Y-m-d");
                    $debtorTransaction->dueDate = \date("Y-m-d");
                    $debtorTransaction->type = "LBC";
                    $debtorTransaction->remarks = "Lay-Bye Return Credit";
                    $debtorTransaction->period = $shop['Period'];
                    $debtorTransaction->vatPer = $shop['Period'];
                    $debtorTransaction->crnref = $docNo;
                    $debtorTransaction->dts = new \DateTime();

                    $debtorTransaction->save();

                    unset($debtorNo);
                }
            }

            if (isset($debtorNo)) {
                $debtorTransaction = new DebtorTransaction();

                $debtorTransaction->accNo = $debtorNo;
                $debtorTransaction->invNo = $docNo;
                $debtorTransaction->invAmt = $totals["total"] - $transaction["tendered"];
                $debtorTransaction->invDate = \date("Y-m-d");
                $debtorTransaction->dueDate = \date("Y-m-d");
                $debtorTransaction->type = $transaction["type"] === "LBC" ? "CRN" : $transaction["type"];
                $debtorTransaction->remarks = "Credit Sale";
                $debtorTransaction->period = $shop['Period'];
                $debtorTransaction->vatPer = $shop['Period'];
                $debtorTransaction->crnref = $docNo;
                $debtorTransaction->dts = new \DateTime();

                /**
                 * @var Debtor $debtor
                 */
                $debtor = Debtor::query()->where("no", $debtorNo)->first();
                if (!$debtor) {
                    DB::rollBack();
                    Log::info("Debtor was not found for the following accNo: " . $debtorNo);
                    return response()->json([], $this->notFoundStatus);
                }

                if ($transaction['type'] === "LBC") {
                    $debtor->balance = $debtor->balance - ($totals["total"] - $transaction["tendered"]);
                    $debtor->current = $debtor->current - ($totals["total"] - $transaction["tendered"]);
                } else {
                    $debtor->balance = $debtor->balance + $totals["total"];
                    $debtor->current = $debtor->current + $totals["total"];
                }

                if ($debtor->stype === 'Staff') {
                    $debtorTransaction->remarks = 'Staff Sale';
                }

                $debtor->save();
                $debtorTransaction->save();

                if ($transaction["tendered"] != 0 && $debtor->stype !== 'Staff') {
                    $depositTransaction = new DebtorTransaction();

                    $debtorTransaction->accNo = $debtorNo;
                    $debtorTransaction->invNo = $docNo;
                    $depositTransaction->invAmt = $transaction["tendered"];
                    $depositTransaction->invDate = \date("Y-m-d");
                    $depositTransaction->dueDate = \date("Y-m-d");
                    $depositTransaction->type = $transaction["type"];
                    $depositTransaction->remarks = "Credit Sale Deposit";
                    $depositTransaction->period = $shop['Period'];
                    $depositTransaction->vatPer = $shop['Period'];
                    $depositTransaction->crnref = $docNo;
                    $depositTransaction->dts = new \DateTime();

                    $depositTransaction->save();
                }
            }

            DB::commit();
            return response()->json(["number" => $docNo], $this->createdStatus);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve all line items for a document number
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveTransaction($id)
    {
        $transactions = DailyTransaction::query()
            ->where('DOCNO', $id)
            ->get();

        if (count($transactions) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "branch" => "", "till" => "", "method" => "",
            "transactions" => array(), "totals" => array("vat" => 0, "total" => 0, "qty" => 0));

        $vat = 0;
        $total = 0;
        $qty = 0;

        /**
         * @var DailyTransaction $item
         */
        foreach ($transactions as $item) {
            $qty++;

            $transaction = array();
            $transaction['code'] = $item->STYLE;
            $transaction['colour'] = $item->CLR;
            $transaction['clrcode'] = $item->CLR;
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;
            $transaction['type'] = $item->DOCTYPE;

            /**
             * @var Product $product
             */
            $product = Product::query()->where('code', $item->STYLE)->get()[0];
            $transaction['description'] = $product->DESCR;

            $transaction['disc'] = $item->DISCAMT;
            $transaction['markdown'] = $item->LSLTYPE === 'M' ? true : false;
            $transaction['price'] = $item->SP;
            $transaction['qty'] = $item->QTY;
            $transaction['subtotal'] = $item->QTY * $item->SP;
            $transaction['total'] = $item->AMT;
            $total += $item->AMT;
            $vat += $item->VATAMT;

            $lineItems["transactions"][] = $transaction;
            $lineItems["method"] = $item->SUP;
            $lineItems["type"] = $item->DOCTYPE;
            $lineItems["branch"] = $item->BRNO;
            $lineItems["till"] = $item->TILLNO;
        }

        $lineItems["totals"]["vat"] = $vat;
        $lineItems["totals"]["qty"] = $qty;
        $lineItems["totals"]["total"] = $total;

        return response()->json(['lineItems' => $lineItems], $this->successStatus);
    }

    /**
     * Print transaction receipt.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function printReceipt($id)
    {
        /**
         * @var Response $response
         */
        $response = $this->retrieveTransaction($id);
        if (!$response->isOk()) {
            return response()->json([], $response->getStatusCode());
        }

        $transaction = $response->getOriginalContent()['lineItems'];

        /**
         * @var DailyTransaction[] $lineItems
         */
        $lineItems = $transaction["transactions"];
        $totals = $transaction["totals"];

        $date = \date('Y-m-d');
        $time = \date("H:i:s");

        /**
         * @var SnappyPdf $snappy
         */
        $snappy = App::make('snappy.pdf');
        $html = View::make('receipt', [
            "transaction_id" => $id,
            "date" => $date,
            "time" => $time,
            "transactions" => $lineItems,
            "totals" => $totals,
            "branch" => $transaction['branch'],
            "till" => $transaction['till'],
            "method" => $transaction['method'],
            "type" => $transaction['type'],
            "tendered" => 0,
            "change" => $totals['total'] - 0
        ]);
        return new Response(
            $snappy->getOutputFromHtml($html),
            200,
            array(
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="file.pdf"'
            )
        );

    }

    /**
     * Save the person details associated with a transaction
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function savePerson(Request $request, $id, $docType)
    {
        $this->validate($request, [
            'email' => 'nullable | email',
            'cell' => 'nullable | max:10 | min:10'
        ]);

        $data = $request->all();

        try {
            DB::beginTransaction();

            $person = new Person($data);
            $person['docNo'] = $id;
            $person['docType'] = $docType;
            $person->save();

            DB::commit();
            return response()->json(["person" => $person], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Save the refund details for an invoice number that was not found
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveRefund(Request $request)
    {
        $this->validate($request, [
            'invNo' => 'required',
            'invType' => 'required',
            'invDate' => 'required',
            'idNo' => 'required',
            'email' => 'nullable | email',
            'cell' => 'required | max:10 | min:10',
            'brNo' => 'required'
        ]);

        $data = $request->all();
        try {
            DB::beginTransaction();

            $refund = new Refund($data);
            $refund->save();

            DB::commit();
            return response()->json([], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve a refund
     *
     * @param $id
     * @param $type
     * @return \Illuminate\Http\Response
     */
    public function retrieveRefund($id, $type)
    {
        if ($type === "LB") {
            $type = "L/B";
        }

        $refund = Refund::query()
            ->where('invNo', $id)
            ->where('invType', $type)
            ->first();

        if ($refund) {
            return response()->json([], $this->validationStatus);
        }

        if ($type === "LB") {
            $laybye = Laybye::query()
                ->where("accNo", $id)
                ->first();

            if ($laybye->balance <= 0) {
                return response()->json([], $this->validationStatus);
            }
        }

        $transactions = StockTransaction::query()
            ->where('REF', $id)
            ->where('BTYPE', $type)
            ->get();

        if (count($transactions) === 0) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "branch" => "", "till" => "", "method" => "",
            "transactions" => array(), "totals" => array("vat" => 0, "total" => 0, "qty" => 0));

        $vat = 0;
        $total = 0;
        $qty = 0;

        /**
         * @var StockTransaction $item
         */
        foreach ($transactions as $item) {
            $qty++;

            $transaction = array();
            $transaction['code'] = $item->STYLE;
            $transaction['colour'] = $item->CLR;
            $transaction['clrcode'] = $item->CLR;
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;
            $transaction['type'] = $item->BTYPE;

            /**
             * @var Product $product
             */
            $product = Product::query()->where('code', $item->STYLE)->first();
            $transaction['description'] = $product->descr;

            $transaction['disc'] = $item->DISCAMT;
            $transaction['markdown'] = $item->SLTYPE === 'M' ? true : false;
            $transaction['isStaff'] = $item->SLTYPE === 'S' ? true : false;
            $transaction['combo'] = $item->SLTYPE === 'D' ? true : false;
            $transaction['price'] = $item->SP;
            $transaction['qty'] = $item->QTY;
            $transaction['subtotal'] = $item->QTY * $item->SP;
            $transaction['total'] = $item->AMT;
            $total += $item->AMT;
            $vat += $item->VATAMT;

            $lineItems["transactions"][] = $transaction;
            $lineItems["type"] = $item->BTYPE;
            $lineItems["branch"] = $item->BRNO;
            $lineItems["date"] = $item->BDATE;
        }

        $person = Person::query()->where('docNo', $id)->first();
        $lineItems["person"] = $person;

        $lineItems["totals"]["vat"] = $vat;
        $lineItems["totals"]["qty"] = $qty;
        $lineItems["totals"]["total"] = $total;

        return response()->json(['lineItems' => $lineItems], $this->successStatus);

    }

    /**
     * Validates authentication for activating staff prices.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateStaff()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating exchanges.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateExchange()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating credit sales.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateCreditSales()
    {
        return response()->json([], $this->successStatus);
    }

    /**
     * Validates authentication for activating refunds.
     *
     * @return \Illuminate\Http\Response
     */
    public function activateRefund()
    {
        return response()->json([], $this->successStatus);
    }

}
