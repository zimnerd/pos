<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Shop;
use App\Till;
use Illuminate\Http\Request;

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
        $tillInfo = Till::query()->where('tillno', $id)->get();

        $details = array();
        foreach ($tillInfo as $info) {
            $details[$info->ColName] = $info->ColValue;
        }

        $details['tillno'] = $id;

        return response()->json(['till' => $details], $this->successStatus);
    }

    /**
     * Register for the application.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveTill(Request $request)
    {
        $this->validate($request, [
            'InvNo' => 'required',
            'DepNo' => 'required',
            'CredInvNo' => 'required',
            'tillno' => 'required'
        ]);

        $till = $request->all();

        $tillInfo = Till::query()
            ->where('tillno', $till['tillno'])
            ->where('tillno', $till['tillno'])
            ->get();

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
            }

            $info->save();
        }

        return response()->json(['till' => $till], $this->successStatus);
    }
}
