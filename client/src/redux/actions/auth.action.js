import { ERROR_RESET, LOGIN_USER, LOGOUT_USER, VALIDATION_ERROR } from "../constants/auth.contants";

export function loginUser(token) {
    return { type: LOGIN_USER, token };
}

export function logout(token = undefined) {
    return { type: LOGOUT_USER, token };
}

export function validationError(errors) {
    return { type: VALIDATION_ERROR, errors };
}

export function errorReset(errors = []) {
    return { type: ERROR_RESET, errors };
}
