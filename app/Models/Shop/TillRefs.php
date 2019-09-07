<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TillRefs extends Model
{
     /**
         * The table associated with the model.
         *
         * @var string
         */
        protected $table = "usertillxref";


        /**
         * The primary key associated with the table.
         *
         * @var string
         */
        protected $primaryKey = "id";

        /**
         * Indicates if the IDs are auto-incrementing.
         *
         * @var bool
         */
        public $incrementing = true;

        /**
         * Indicates if the model should be timestamped.
         *
         * @var bool
         */
        public $timestamps = true;

        public $fillable = [
            'tillno',
            'user',
            'default_tillno'
        ];
}
