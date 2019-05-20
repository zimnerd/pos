import { RETRIEVE_SHOP_DETAILS } from "../constants/settings.constants";

export default function settingsReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_SHOP_DETAILS:
            return { ...state, shop: action.shop };
        default:
            return state;
    }
}
