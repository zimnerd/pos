import {
    CLOSE_OTHERS_MODAL,
    CLOSE_RETURNS_MODAL, CLOSE_SALES_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_RETURNS_MODAL, OPEN_SALES_MODAL
} from "../constants/modal.constants";

export function openReturns(returns = true) {
    return { type: OPEN_RETURNS_MODAL, returns }
}

export function closeReturns(returns = false) {
    return { type: CLOSE_RETURNS_MODAL, returns }
}

export function openSales(sales = true) {
    debugger
    return { type: OPEN_SALES_MODAL, sales }
}

export function closeSales(sales = false) {
    return { type: CLOSE_SALES_MODAL, sales }
}

export function openOthers(others = true) {
    return { type: OPEN_OTHERS_MODAL, others }
}

export function closeOthers(others = false) {
    return { type: CLOSE_OTHERS_MODAL, others }
}
