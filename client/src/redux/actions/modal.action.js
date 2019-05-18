import { CLOSE_RETURNS_MODAL, OPEN_RETURNS_MODAL } from "../constants/modal.constants";

export function openReturns(returns = true) {
    return { type: OPEN_RETURNS_MODAL, returns }
}

export function closeReturns(returns = false) {
    return { type: CLOSE_RETURNS_MODAL, returns }
}
