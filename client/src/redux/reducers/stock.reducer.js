import { RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export default function stockReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_PRODUCTS:
            return { ...state, page: action.page };
        default:
            return state;
    }
}
