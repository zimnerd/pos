<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Permissions;
use App\Role;
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
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->all();

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $token = $user->createToken($credentials['username'], ['user'])->accessToken;
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
        $input['role'] = "T";

        $user = User::create($input);

        $success['token'] = $user->createToken($user->username, ['user'])->accessToken;
        $success['name'] = $user->name;

        return response()->json(['success' => $success], $this->createStatus);
    }

    /**
     * Retrieve the details of the supplied user.
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        /** @var User $user */
        $user = Auth::user();

        /** @var Role $role */
        $role = Role::query()->where('code', $user->role)->first();
        $user->role = $role;

        return response()->json(['user' => $user], $this->successStatus);
    }

    /**
     * Check the supplied details as an admin user.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function adminLogin(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->all();

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $roles = $this->mapPermissions($user['role']);

            $token = $user->createToken($credentials['username'], $roles)->accessToken;
            $success['token'] = $token;
            $user['api_token'] = $token;

            $user->save();

            return response()->json(['success' => $success], $this->successStatus);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }

    private function mapPermissions($role)
    {
        $roles = ["user"];

        /** @var Permissions $permissions */
        $permissions = Permissions::query()
            ->where('code', $role)
            ->first();

        if ($permissions->staffPrices) {
            $roles[] = 'staff';
        }

        if ($permissions->priceAmendments) {
            $roles[] = 'amendments';
        }

        if ($permissions->creditSales) {
            $roles[] = 'sales';
        }

        if ($permissions->creditNotes) {
            $roles[] = 'notes';
        }

        return $roles;
    }

}
