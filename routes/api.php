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

Route::group(["prefix" => "api/user"], function () {

    Route::post('login', 'Api\Authentication\UserController@login');
    Route::post('register', 'Api\Authentication\UserController@register');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('details', 'Api\Authentication\UserController@details');
    });

});

Route::group(["prefix" => "api/products"], function () {

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('', 'Api\Product\ProductController@retrieveStock');
        Route::get('{code}', 'Api\Product\ProductController@retrieveProduct');
        Route::get('{code}/combos', 'Api\Product\ProductController@retrieveCombos');
        Route::get('{code}/{serialno}', 'Api\Product\ProductController@retrieveItem');
        Route::get('{code}/{size}/{colour}', 'Api\Product\ProductController@retrieveProductWithCode');
    });

});

Route::group(["prefix" => "api/settings"], function () {

    Route::get('shop', 'Api\Settings\SettingsController@retrieveShopDetails');
    Route::get('till/{id}', 'Api\Settings\SettingsController@retrieveTillDetails');
    Route::post('till/{id}', 'Api\Settings\SettingsController@saveTill');

});

Route::group(["prefix" => "api/transactions"], function () {

    Route::get('{id}/print', 'Api\Transaction\TransactionController@printReceipt');

    Route::group(['middleware' => 'auth:api'], function () {

        Route::post('', 'Api\Transaction\TransactionController@createTransaction');

        Route::post('hold', 'Api\Transaction\TransactionController@holdSale');
        Route::get('hold/{id}', 'Api\Transaction\TransactionController@retrieveSale');

    });

});
