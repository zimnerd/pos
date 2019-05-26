import {
    CLOSE_AUTH_MODAL,
    CLOSE_CARD_MODAL,
    CLOSE_CASH_MODAL,
    CLOSE_COMPLETE_SALE_MODAL,
    CLOSE_CREDIT_MODAL,
    CLOSE_OTHERS_MODAL,
    CLOSE_PAYMENTS_MODAL,
    CLOSE_PRODUCT_STYLE_MODAL, CLOSE_RETRIEVE_HELD_MODAL,
    CLOSE_RETURNS_MODAL,
    CLOSE_SALES_MODAL,
    CLOSE_TRANSACTION_MODAL,
    OPEN_AUTH_MODAL,
    OPEN_CARD_MODAL,
    OPEN_CASH_MODAL,
    OPEN_COMPLETE_SALE_MODAL,
    OPEN_CREDIT_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_PAYMENTS_MODAL,
    OPEN_PRODUCT_STYLE_MODAL, OPEN_RETRIEVE_HELD_MODAL,
    OPEN_RETURNS_MODAL,
    OPEN_SALES_MODAL,
    OPEN_TRANSACTION_MODAL
} from "../constants/modal.constants";

export default function modalReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case OPEN_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case CLOSE_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case OPEN_PAYMENTS_MODAL:
            return { ...state, payments: action.payments };
        case CLOSE_PAYMENTS_MODAL:
            return { ...state, payments: action.payments };
        case OPEN_SALES_MODAL:
            return { ...state, sales: action.sales };
        case CLOSE_SALES_MODAL:
            return { ...state, sales: action.sales };
        case OPEN_COMPLETE_SALE_MODAL:
            return { ...state, complete: action.complete };
        case CLOSE_COMPLETE_SALE_MODAL:
            return { ...state, complete: action.complete };
        case OPEN_CREDIT_MODAL:
            return { ...state, credit: action.credit };
        case CLOSE_CREDIT_MODAL:
            return { ...state, credit: action.credit };
        case OPEN_PRODUCT_STYLE_MODAL:
            return { ...state, styles: action.styles };
        case CLOSE_PRODUCT_STYLE_MODAL:
            return { ...state, styles: action.styles };
        case OPEN_AUTH_MODAL:
            return { ...state, auth: action.auth };
        case CLOSE_AUTH_MODAL:
            return { ...state, auth: action.auth };
        case OPEN_OTHERS_MODAL:
            return { ...state, others: action.others };
        case CLOSE_OTHERS_MODAL:
            return { ...state, others: action.others };
        case OPEN_CASH_MODAL:
            return { ...state, cash: action.cash };
        case CLOSE_CASH_MODAL:
            return { ...state, cash: action.cash };
        case OPEN_CARD_MODAL:
            return { ...state, card: action.card };
        case CLOSE_CARD_MODAL:
            return { ...state, card: action.card };
        case OPEN_TRANSACTION_MODAL:
            return { ...state, transaction: action.transaction };
        case CLOSE_TRANSACTION_MODAL:
            return { ...state, transaction: action.transaction };
        case OPEN_RETRIEVE_HELD_MODAL:
            return { ...state, retrieveHeld: action.retrieveHeld };
        case CLOSE_RETRIEVE_HELD_MODAL:
            return { ...state, retrieveHeld: action.retrieveHeld };
        default:
            return state;
    }
}
