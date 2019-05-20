<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public $successStatus = 200;
    public $createStatus = 201;

    /**
     * Login to the application.
     *
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login()
    {
        $credentials = ['username' => request('username'), 'password' => request('password')];
        $request = new Request($credentials);

        /** @var Request $request */
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $token = $user->createToken($credentials['username'])->accessToken;
            $success['token'] = $token;
            $user['api_token'] = $token;

            $user->save();

            return response()->json(['success' => $success], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    /**
     * Register for the application.
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
            'password' => 'required',
            'confirm' => 'required|same:password'
        ]);

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);

        $success['token'] = $user->createToken($user->username)->accessToken;
        $success['name'] = $user->name;

        return response()->json(['success' => $success], $this->createStatus);
    }

    /**
     * Retrieve the details of the supplied user.
     *
     * @return \Illuminate\Http\Response
     */
    public function details() {
        $user = Auth::user();
        return response()->json(['user' => $user], $this->successStatus);
    }
}
