<?php

namespace App\Http\Controllers\Api\Settings;

use App\ComboPrice;
use App\Haddith;
use App\Http\Controllers\Controller;
use App\Models\Shop\TillDetails;
use App\Reason;
use App\Shop;
use App\Till;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{

    public $successStatus = 200;
    public $notFoundStatus = 404;
    public $errorStatus = 500;

    /**
     * Retrieve the shop settings
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveShopDetails()
    {
        $shopInfo = Shop::all();

        $details = array();
        foreach ($shopInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        return response()->json(['shop' => $details], $this->successStatus);
    }

    /**
     * Retrieve the till settings
     *
     * @param integer $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveTillDetails($id)
    {
        $tillInfo = Till::query()->where('tillno', $id)->get();

        if (!$tillInfo) {
            return response()->json([], $this->notFoundStatus);
        }

        $details = array();
        foreach ($tillInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        $details['tillno'] = $id;

        return response()->json(['till' => $details], $this->successStatus);
    }

    /**
     * Retrieve the till settings
     *
     * @param integer $id
     * @return \Illuminate\Http\Response
     */
    public function retrieveHaddith()
    {
        /**
         * @var Shop $rotateDate
         */
        $rotateDate = Shop::query()->where('ColName', 'LastHaddithRotatedDate')->first();

        if (!$rotateDate) {
            return response()->json([], $this->notFoundStatus);
        }

        $nowDateTime = \date('Y-m-d');

        /**
         * @var Haddith $haddith
         */
        $haddith = Haddith::query()->where('active', true)->first();

        if ($nowDateTime > $rotateDate['ColValue']) {
            $haddith->active = false;
            $haddith->save();

            $haddith = Haddith::query()->where('id', $haddith->id + 1)->first();
            if (empty($haddith)) {
                $haddith = Haddith::query()->where('id', 1)->first();
            }

            $haddith->active = true;
            $haddith->save();

            $rotateDate->ColValue = $nowDateTime;
            $rotateDate->save();
        }

        return response()->json(['haddith' => $haddith], $this->successStatus);
    }

    /**
     * Save the till settings.
     *
     * @param string $id
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveTill($id, Request $request)
    {
        $this->validate($request, [
            'InvNo' => 'required',
            'DepNo' => 'required',
            'CredInvNo' => 'required',
            'LbNo' => 'required',
            'CrnNo' => 'required',
            'tillno' => 'required'
        ]);

        $till = $request->all();

        $tillInfo = Till::query()
            ->where('tillno', $id)
            ->get();

        if (!$tillInfo) {
            return response()->json([], $this->notFoundStatus);
        }

        try {
            DB::beginTransaction();

            /**
             * @var Till $info
             */
            foreach ($tillInfo as $info) {
                switch ($info->ColName) {
                    case "InvNo":
                        $info->ColValue = $request['InvNo'];
                        break;
                    case "DepNo":
                        $info->ColValue = $request['DepNo'];
                        break;
                    case "CredInvNo":
                        $info->ColValue = $request['CredInvNo'];
                        break;
                    case "CrnNo":
                        $info->ColValue = $request['CrnNo'];
                        break;
                    case "LbNo":
                        $info->ColValue = $request['LbNo'];
                        break;
                    case "TempDocNo":
                        $info->ColValue = $request['TempDocNo'];
                        break;
                }

                $info->save();
            }

            DB::commit();
            return response()->json(['till' => $till], $this->successStatus);
        } catch (\PDOException $e) {
            Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
            return response()->json([], $this->errorStatus);
        }
    }

    /**
     * Retrieve all running combos
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveCombos()
    {
        $now = date('Y-m-d');
        $combos = ComboPrice::query()
            ->select('comboprice.code', 'comboprice.style', 'comboprice.rp', 'comboprice.qty', 'combostyle.description')
            ->join('combostyle', 'combostyle.code', '=', 'comboprice.code')
            ->where('combostyle.active', 1)
            ->where('combostyle.startdate', '<=', $now)
            ->where('combostyle.enddate', '>=', $now)
            ->get();

        if (!$combos) {
            return response()->json(['error' => 'The combo cannot be found.'], $this->notFoundStatus);
        }

        return response()->json(['combos' => $combos], $this->successStatus);
    }

    /**
     * Retrieves the list of all refund reasons.
     *
     * @return \Illuminate\Http\Response
     */
    public function refundReasons()
    {
        $reasons = Reason::all();
        return response()->json(["reasons" => $reasons], $this->successStatus);
    }

    /**
     * Retrieves the active till number.
     *
     * @return \Illuminate\Http\Response
     */
    public function retrieveTillNumber()
    {
        $details = TillDetails::query()->first();
        if (!$details) {
            return response()->json(['error' => 'The datasource containing the till number has not be setup.'],
                $this->notFoundStatus);
        }

        return response()->json(["number" => $details['tillno']], $this->successStatus);
    }

}
