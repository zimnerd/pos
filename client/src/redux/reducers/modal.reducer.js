import {
    CLOSE_OTHERS_MODAL,
    CLOSE_RETURNS_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_RETURNS_MODAL
} from "../constants/modal.constants";

export default function modalReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case OPEN_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case CLOSE_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        case OPEN_OTHERS_MODAL:
            return { ...state, others: action.others };
        case CLOSE_OTHERS_MODAL:
            return { ...state, others: action.others };
        default:
            return state;
    }
}
