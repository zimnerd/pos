import {
    ACTIVATE_LAY_BYE,
    ACTIVATE_RETURNS,
    SET_TRANSACTIONS,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_RETURNS, RESET_TOTALS, RESET_TRANSACTIONS,
    SET_TOTALS, SET_TRANSACTION_ID
} from "../constants/till.constants";

export default function tillReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case ACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case DEACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case SET_TRANSACTIONS:
            console.log(action, "jere");
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
        default:
            return state;
    }
}
