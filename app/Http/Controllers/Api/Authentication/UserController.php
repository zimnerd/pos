<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public $successStatus = 200;
    public $createStatus = 201;

    /**
     * login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login()
    {
        $credentials = ['username' => request('username'), 'password' => request('password')];
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $success['token'] = $user->createToken($credentials['username'])->accessToken;
            return response()->json(['success' => $success], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    /**
     * Register api
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'username' => 'required',
            'email' => 'required|email',
            'username' => 'required',
            'password' => 'required',
            'confirm' => 'required|same:password',
        ]);

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);

        $success['token'] = $user->createToken($user->username)->accessToken;
        $success['name'] = $user->name;

        return response()->json(['success' => $success], $this->createStatus);
    }

    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $user = Auth::user();
        return response()->json(['success' => $user], $this->successStatus);
    }
}
