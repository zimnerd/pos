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
        Route::get('{code}/{size}/{colour}', 'Api\Product\ProductController@retrieveProductWithCode');
    });

});

Route::group(["prefix" => "api/settings"], function () {

    Route::get('shop', 'Api\Settings\SettingsController@retrieveShopDetails');
    Route::get('till/{id}', 'Api\Settings\SettingsController@retrieveTillDetails');

});
