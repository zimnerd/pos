import { RETRIEVE_SHOP_DETAILS, RETRIEVE_TILL_DETAILS, SAVE_TILL_DETAILS } from "../constants/settings.constants";

export default function settingsReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_SHOP_DETAILS:
            return { ...state, shop: action.shop };
        case RETRIEVE_TILL_DETAILS:
            return { ...state, till: action.till };
        case SAVE_TILL_DETAILS:
            return { ...state, till: action.till };
        default:
            return state;
    }
}
