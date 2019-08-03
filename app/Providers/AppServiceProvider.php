<?php

namespace App\Providers;

use App\DbDetails;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        Passport::withCookieSerialization();

        $details = DbDetails::all();
        $detail = $details[count($details) - 1];

        Config::set('database.connections.mysql.database', $detail->dbName);
        DB::purge('mysql');
    }
}
