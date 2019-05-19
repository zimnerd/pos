import {
    ACTIVATE_LAY_BYE,
    ACTIVATE_RETURNS,
    ADD_LINE_ITEM,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_RETURNS
} from "../constants/till.constants";

export default function tillReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case ACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case DEACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case ADD_LINE_ITEM:
            return { ...state, transactions: action.transactions };
        case ACTIVATE_RETURNS:
            return { ...state, ...action.returns };
        case DEACTIVATE_RETURNS:
            debugger
            return { ...state, returns: action.returns };
        default:
            return state;
    }
}
