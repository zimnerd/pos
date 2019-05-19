import { RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export default function stockReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case RETRIEVE_PRODUCTS:
            debugger
            return { ...state, products: action.products };
        default:
            return state;
    }
}
