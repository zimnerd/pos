import { ERROR_RESET, LOGIN_USER, VALIDATION_ERROR } from "../constants/auth.contants";

export function loginUser(token) {
    return { type: LOGIN_USER, token };
}

export function validationError(errors) {
    return { type: VALIDATION_ERROR, errors };
}

export function errorReset(errors = []) {
    return { type: ERROR_RESET, errors };
}
