import {
    CLOSE_CREDIT_MODAL,
    CLOSE_OTHERS_MODAL,
    CLOSE_RETURNS_MODAL, CLOSE_SALES_MODAL,
    OPEN_CREDIT_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_RETURNS_MODAL, OPEN_SALES_MODAL
} from "../constants/modal.constants";

export default function modalReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case OPEN_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case CLOSE_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case OPEN_SALES_MODAL:
            return { ...state, sales: action.sales };
        case CLOSE_SALES_MODAL:
            return { ...state, sales: action.sales };
        case OPEN_CREDIT_MODAL:
            return { ...state, credit: action.credit };
        case CLOSE_CREDIT_MODAL:
            return { ...state, credit: action.credit };
        case OPEN_OTHERS_MODAL:
            return { ...state, others: action.others };
        case CLOSE_OTHERS_MODAL:
            return { ...state, others: action.others };
        default:
            return state;
    }
}
