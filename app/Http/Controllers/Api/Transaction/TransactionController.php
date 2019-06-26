<?php

namespace App\Http\Controllers\Api\Transaction;

use App\Airtime;
use App\Colours;
use App\DailyControl;
use App\DailySummary;
use App\DailyTransaction;
use App\Handset;
use App\Http\Controllers\Controller;
use App\Person;
use App\Product;
use App\Refund;
use App\Sale;
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
        $this->validate($request, [
            'shop' => 'required',
            'till' => 'required',
            'transactions' => 'required',
            'totals' => 'required',
            'person.email' => 'nullable | email',
            'person.cell' => 'nullable | max:10 | min:10'
        ]);

        $transaction = $request->all();

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
            switch ($transaction["type"]) {
                case "INV":
                    $docNo = $till['tillno'] . $till["InvNo"];
                    break;
                case "CRN":
                    $docNo = $till['tillno'] . $till["CrnNo"];
                    break;
                case "L/B":
                    $docNo = $till['tillno'] . $till["LbNo"];
                    break;
            }

            $count = 1;
            foreach ($lineItems as $item) {
                if (!isset($item['markdown'])) {
                    $item['markdown'] = false;
                }

                $dailyTransaction = new DailyTransaction();
                $dailyTransaction->BRNO = $shop['BrNo'];
                $dailyTransaction->TILLNO = $till['tillno'];
                $dailyTransaction->STYLE = $item['code'];
                $dailyTransaction->SIZES = $item['size'];
                $dailyTransaction->CLR = $item['colour'];

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
                    $dailyTransaction->STYPE = $transaction['stype'];
                } else {
                    $dailyTransaction->STYPE = $transaction["method"];
                }

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

                $count++;
                $dailyTransaction->save();

                $colour = Colours::query()
                    ->where("colour", $item['colour'])
                    ->first();

                /**
                 * @var Stock $stock
                 */
                $stock = Stock::query()
                    ->where("STYLE", $item['code'])
                    ->where("SIZES", $item['size'])
                    ->where("CLR", $colour->code)
                    ->first();

                $stock->QOH = $stock->QOH - 1;
                $stock->save();

                if (isset($item['serialno'])) {

                    $queryBuilder = Handset::query();
                    $queryBuilder->where('code', $dailyTransaction->STYLE)
                        ->where('serialno', $dailyTransaction->SERIALNO);
                    /**
                     * @var Handset $item
                     */
                    $item = $queryBuilder->first();

                    if (!$item) {
                        $queryBuilder = Airtime::query();
                        $queryBuilder->where('code', $dailyTransaction->STYLE)
                            ->where('serialno', $dailyTransaction->SERIALNO);
                        /**
                         * @var Airtime $item
                         */
                        $item = $queryBuilder->first();
                    }

                    $item->solddate = new \DateTime();
                    $item->save();
                }
            }

            $summmary = new DailySummary();
            $summmary->BDATE = \date("Y-m-d");
            $summmary->BRNO = $shop['BrNo'];
            $summmary->BTYPE = $transaction["type"] !== "CRN" ? "DEP" : "PAY";
            $summmary->TRANNO = $till['tillno'] . $transaction["type"] === "INV" ? $till['DepNo'] : $till['CredInvNo'];
            $summmary->TAXCODE = null;
            $summmary->VATAMT = $totals["vat"];
            $summmary->AMT = $totals["total"];
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

            if (isset($transaction['debtor'])) {
                $summmary->DEBTOR = $transaction['debtor'];
            } else {
                $summmary->DEBTOR = "Cash";
            }

            $summmary->BUSER = $user->username;
            $summmary->AUSER = $transaction["auth"];
            $summmary->PERIOD = $shop['Period'];
            $summmary->CCQNUM = "";
            $summmary->save();

            $control = new DailyControl();
            $control->docnum = $docNo;
            $control->transtype = $transaction["type"];
            $control->save();

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
            $this->savePerson($request, $docNo);

            DB::commit();
            return response()->json(["number" => $docNo], $this->createdStatus);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Hold a sale
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function holdSale(Request $request)
    {
        $this->validate($request, [
            'transactions' => 'required',
            'till' => 'required',
            'type' => 'required'
        ]);

        $lineItems = $request->all();

        try {
            DB::beginTransaction();
            $transactions = $lineItems['transactions'];

            $till = $lineItems['till'];
            $docNo = $till['tillno'] . $till['InvNo'];

            foreach ($transactions as $transaction) {
                $sale = new Sale();
                $sale->docnum = $docNo;
                $sale->type = $lineItems['type'];
                $sale->code = $transaction['code'];
                $sale->colour = $transaction['colour'];
                $sale->cost = $transaction['cost'];
                $sale->description = $transaction['description'];
                $sale->disc = $transaction['disc'];
                $sale->markdown = $transaction['markdown'];
                $sale->price = $transaction['price'];
                $sale->qty = $transaction['qty'];
                $sale->size = $transaction['size'];
                $sale->subtotal = $transaction['subtotal'];
                $sale->total = $transaction['total'];

                $sale->save();
            }

            DB::commit();
            return response()->json(['sale' => $docNo], $this->createdStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }


    /**
     * Retrieve a held sale
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveSale($id)
    {
        $sales = Sale::query()
            ->where('docnum', $id)
            ->get();

        if (!$sales) {
            return response()->json([], $this->notFoundStatus);
        }

        $lineItems = array("type" => "", "transactions" => array());

        /**
         * @var Sale $sale
         */
        foreach ($sales as $sale) {
            $transaction = array();
            $transaction['code'] = $sale->code;
            $transaction['colour'] = $sale->colour;
            $transaction['size'] = $sale->size;
            $transaction['cost'] = $sale->cost;
            $transaction['description'] = $sale->description;
            $transaction['disc'] = $sale->disc;
            $transaction['markdown'] = $sale->markdown;
            $transaction['price'] = $sale->price;
            $transaction['qty'] = $sale->qty;
            $transaction['subtotal'] = $sale->subtotal;
            $transaction['total'] = $sale->total;

            $lineItems["transactions"][] = $transaction;
            $lineItems["type"] = $sale->type;
        }

        return response()->json(['lineItems' => $lineItems], $this->successStatus);
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

        $lineItems = array("type" => "", "branch" => "", "till" => "",
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
            $transaction['size'] = $item->SIZES;
            $transaction['cost'] = $item->CP;

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
            $lineItems["type"] = $item->SUP;
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
            "method" => $transaction['type'],
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
    public function savePerson(Request $request, $id)
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
            $person->save();

            DB::commit();
            return response()->json([], $this->createdStatus);
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
            'invDate' => 'required',
            'idNo' => 'required',
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

}
