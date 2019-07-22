<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(["prefix" => "user"], function () {

    Route::post('login', 'Api\Authentication\UserController@login');
    Route::post('admin/login', 'Api\Authentication\UserController@adminLogin');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('details', 'Api\Authentication\UserController@details');
        Route::post('register', 'Api\Authentication\UserController@register');
    });

});

Route::group(["prefix" => "products"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('', 'Api\Product\ProductController@retrieveStock');
        Route::get('{code}', 'Api\Product\ProductController@retrieveProduct');
        Route::get('{code}/combos', 'Api\Product\ProductController@retrieveCombos');
        Route::get('{code}/{serialno}', 'Api\Product\ProductController@retrieveItem');
        Route::get('{code}/{size}/{colour}', 'Api\Product\ProductController@retrieveProductWithCode');
    });

});

Route::group(["prefix" => "people"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('{cell}', 'Api\PersonController@retrievePerson');
    });

});

Route::group(["prefix" => "settings"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('combos', 'Api\Settings\SettingsController@retrieveCombos');
    });

    Route::get('haddith', 'Api\Settings\SettingsController@retrieveHaddith');
    Route::get('shop', 'Api\Settings\SettingsController@retrieveShopDetails');
    Route::get('till/{id}', 'Api\Settings\SettingsController@retrieveTillDetails');
    Route::post('till/{id}', 'Api\Settings\SettingsController@saveTill');
    Route::get('till', 'Api\Settings\SettingsController@retrieveTillNumber');
    Route::get('reasons', 'Api\Settings\SettingsController@refundReasons');

});

Route::group(["prefix" => "auth"], function () {
    Route::get('roles', 'Api\Authentication\AuthenticationController@retrieveRoles');
});

Route::group(["prefix" => "debtors"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('', 'Api\Transaction\DebtorController@retrieveDebtors');
        Route::post('', 'Api\Transaction\DebtorController@saveDebtor');

        Route::get('{id}', 'Api\Transaction\DebtorController@retrieveDebtor');
        Route::post('{id}', 'Api\Transaction\DebtorController@payDebtor');
    });

});

Route::group(["prefix" => "laybyes"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('', 'Api\Transaction\LaybyeController@retrieveLayByes');
        Route::get('{id}', 'Api\Transaction\LaybyeController@retrieveLayBye');
        Route::post('{id}', 'Api\Transaction\LaybyeController@payLayBye');

        Route::get('{id}/transactions', 'Api\Transaction\LaybyeController@retrieveLayByeTransactions');
    });

});

Route::group(["prefix" => "sales"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('', 'Api\Transaction\SaleController@getSales');
        Route::get('{id}', 'Api\Transaction\SaleController@retrieveSale');
        Route::post('', 'Api\Transaction\SaleController@holdSale');
    });

});

Route::group(["prefix" => "airtime"], function () {

    Route::get('{code}/print/{serialNo}', 'Api\Product\AirtimeController@printVoucher');

});

Route::group(["prefix" => "transactions"], function () {

    Route::get('{id}/print', 'Api\Transaction\TransactionController@printReceipt');

    Route::group(['middleware' => 'auth:api'], function () {

        Route::post('', 'Api\Transaction\TransactionController@createTransaction');
        Route::get('{id}', 'Api\Transaction\TransactionController@retrieveTransaction');

        Route::post('refunds', 'Api\Transaction\TransactionController@saveRefund');
        Route::get('{id}/refunds', 'Api\Transaction\TransactionController@retrieveRefund');
    });

    Route::group(['middleware' => ['auth:api', 'scope:staff']], function () {
        Route::get('activate/staff', 'Api\Transaction\TransactionController@activateStaff');
    });

    Route::group(['middleware' => ['auth:api', 'scope:notes']], function () {
        Route::get('activate/exchange', 'Api\Transaction\TransactionController@activateExchange');
    });

    Route::group(['middleware' => ['auth:api', 'scope:sales']], function () {
        Route::get('activate/credit', 'Api\Transaction\TransactionController@activateCreditSales');
    });

});
