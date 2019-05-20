<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Shop;

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
            $details[$info->ColName][] = $info->ColValue;
        }

        return response()->json(['shop' => $details], $this->successStatus);
    }

}
