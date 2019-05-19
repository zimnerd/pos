import { ACTIVATE_LAY_BYE, ADD_LINE_ITEM, DEACTIVATE_LAY_BYE } from "../constants/till.constants";

export default function tillReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case ACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case DEACTIVATE_LAY_BYE:
            return { ...state, laybye: action.activate };
        case ADD_LINE_ITEM:
            return { ...state, transactions: action.transactions };
        default:
            return state;
    }
}
