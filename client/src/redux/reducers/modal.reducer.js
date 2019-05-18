import { OPEN_RETURNS_MODAL, CLOSE_RETURNS_MODAL } from "../constants/modal.constants";

export default function modalReducer(state = { errors: [] }, action) {
    switch (action.type) {
        case OPEN_RETURNS_MODAL:
            debugger;
            return { ...state, returns: action.returns };
        case CLOSE_RETURNS_MODAL:
            return { ...state, returns: action.returns };
        default:
            return state;
    }
}
