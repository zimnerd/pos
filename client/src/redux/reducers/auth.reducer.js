import { ERROR_RESET, LOGIN_USER, LOGOUT_USER, VALIDATION_ERROR } from "../constants/auth.contants";

export default function authReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, token: action.token };
        case LOGOUT_USER:
            return { ...state, ...action.token };
        case VALIDATION_ERROR:
            return { ...state, errors: action.errors };
        case ERROR_RESET:
            return { ...state, errors: action.errors };
        default:
            return state;
    }
}
