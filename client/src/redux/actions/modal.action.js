import {
    CLOSE_OTHERS_MODAL,
    CLOSE_RETURNS_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_RETURNS_MODAL
} from "../constants/modal.constants";

export function openReturns(returns = true) {
    return { type: OPEN_RETURNS_MODAL, returns }
}

export function closeReturns(returns = false) {
    return { type: CLOSE_RETURNS_MODAL, returns }
}

export function openOthers(others = true) {
    return { type: OPEN_OTHERS_MODAL, others }
}

export function closeOthers(others = false) {
    return { type: CLOSE_OTHERS_MODAL, others }
}
