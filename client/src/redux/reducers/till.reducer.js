import {
    ACTIVATE_EXCHANGE,
    ACTIVATE_LAY_BYE,
    ACTIVATE_RETURNS,
    ACTIVATE_STAFF,
    DEACTIVATE_EXCHANGE,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_RETURNS,
    DEACTIVATE_STAFF,
    RESET_TOTALS,
    RESET_TRANSACTIONS,
    SET_AUTH_COMMAND, SET_CODE,
    SET_TOTALS,
    SET_TRANSACTION_ID,
    SET_TRANSACTIONS
} from "../constants/till.constants";

export default function tillReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case ACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case DEACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case SET_TRANSACTIONS:
            return { ...state, transactions: action.transactions };
        case ACTIVATE_RETURNS:
            return { ...state, ...action.returns };
        case DEACTIVATE_RETURNS:
            return { ...state, returns: action.returns };
        case SET_TOTALS:
            return { ...state, totals: action.totals };
        case RESET_TOTALS:
            return { ...state, totals: action.totals };
        case RESET_TRANSACTIONS:
            return { ...state, transactions: action.transactions };
        case SET_TRANSACTION_ID:
            return { ...state, held: action.held };
        case SET_AUTH_COMMAND:
            return { ...state, command: action.command };
        case ACTIVATE_EXCHANGE:
            return { ...state, exchange: action.exchange };
        case DEACTIVATE_EXCHANGE:
            return { ...state, exchange: action.exchange };
        case ACTIVATE_STAFF:
            return { ...state, staff: action.staff };
        case DEACTIVATE_STAFF:
            return { ...state, staff: action.staff };
        case SET_CODE:
            return { ...state, code: action.code };
        default:
            return state;
    }
}
