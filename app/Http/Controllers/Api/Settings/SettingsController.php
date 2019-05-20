<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Shop;
use App\Till;

class SettingsController extends Controller
{

    public $successStatus = 200;

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
        $tillInfo = Till::where('tillno', $id);

        $details = array();
        foreach ($tillInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        return response()->json(['till' => $details], $this->successStatus);
    }

}
