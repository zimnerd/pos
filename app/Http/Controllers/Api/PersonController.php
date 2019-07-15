<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Person;

class PersonController extends Controller
{
    public $successStatus = 200;
    public $notFoundStatus = 404;

    /**
     * Retrieve a person
     *
     * @param $idNumber
     * @return \Illuminate\Http\Response
     */
    public function retrievePerson($idNumber)
    {
        $person = Person::query()
            ->where("idNo", $idNumber)
            ->first();

        if (!$person) {
            return response()->json([], $this->notFoundStatus);
        }

        return response()->json(["person" => $person], $this->successStatus);
    }

}
