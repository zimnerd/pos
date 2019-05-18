import {
    CLOSE_COMPLETE_SALE_MODAL,
    CLOSE_CREDIT_MODAL,
    CLOSE_OTHERS_MODAL,
    CLOSE_PAYMENTS_MODAL,
    CLOSE_RETURNS_MODAL,
    CLOSE_SALES_MODAL,
    OPEN_COMPLETE_SALE_MODAL,
    OPEN_CREDIT_MODAL,
    OPEN_OTHERS_MODAL,
    OPEN_PAYMENTS_MODAL,
    OPEN_RETURNS_MODAL,
    OPEN_SALES_MODAL
} from "../constants/modal.constants";

export function openCompleteSale(complete = true) {
    return { type: OPEN_COMPLETE_SALE_MODAL, complete }
}

export function closeCompleteSale(complete = false) {
    return { type: CLOSE_COMPLETE_SALE_MODAL, complete }
}

export function openReturns(returns = true) {
    return { type: OPEN_RETURNS_MODAL, returns }
}

export function closeReturns(returns = false) {
    return { type: CLOSE_RETURNS_MODAL, returns }
}

export function openSales(sales = true) {
    return { type: OPEN_SALES_MODAL, sales }
}

export function closeSales(sales = false) {
    return { type: CLOSE_SALES_MODAL, sales }
}

export function openCredit(credit = true) {
    return { type: OPEN_CREDIT_MODAL, credit }
}

export function closeCredit(credit = false) {
    return { type: CLOSE_CREDIT_MODAL, credit }
}

export function openPayments(payments = true) {
    return { type: OPEN_PAYMENTS_MODAL, payments }
}

export function closePayments(payments = false) {
    return { type: CLOSE_PAYMENTS_MODAL, payments }
}

export function openOthers(others = true) {
    return { type: OPEN_OTHERS_MODAL, others }
}

export function closeOthers(others = false) {
    return { type: CLOSE_OTHERS_MODAL, others }
}
