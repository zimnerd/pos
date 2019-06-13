import {
    ACTIVATE_EXCHANGE,
    ACTIVATE_LAY_BYE,
    ACTIVATE_REFUND,
    ACTIVATE_RETURNS,
    ACTIVATE_STAFF,
    DEACTIVATE_EXCHANGE,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_REFUND,
    DEACTIVATE_RETURNS,
    DEACTIVATE_STAFF,
    RESET_TOTALS,
    RESET_TRANSACTIONS,
    SET_AUTH_COMMAND,
    SET_CODE,
    SET_COMBOS,
    SET_REFUND,
    SET_TOTALS,
    SET_TRANSACTION_ID,
    SET_TRANSACTIONS,
    VALIDATION_ERROR
} from "../constants/till.constants";

export function activateLayBye(activate = true) {
    return { type: ACTIVATE_LAY_BYE, activate }
}

export function deactivateLayBye(activate = false) {
    return { type: DEACTIVATE_LAY_BYE, activate }
}

export function setTransactions(transactions = []) {
    return { type: SET_TRANSACTIONS, transactions }
}

export function activateReturns(returns = {}) {
    return { type: ACTIVATE_RETURNS, returns }
}

export function deactivateReturns(returns = undefined) {
    return { type: DEACTIVATE_RETURNS, returns }
}

export function setTotals(totals = {}) {
    return { type: SET_TOTALS, totals }
}

export function resetTotals() {
    let totals = {
        total: 0,
        subtotal: 0,
        vat: 0,
        discount: 0
    };
    return { type: RESET_TOTALS, totals }
}

export function resetTransactions() {
    let transactions = [];
    return { type: RESET_TRANSACTIONS, transactions }
}

export function setTransactionId(held = "") {
    return { type: SET_TRANSACTION_ID, held }
}

export function setAuthCommand(command = "") {
    return { type: SET_AUTH_COMMAND, command }
}

export function activateExchange(exchange = true) {
    return { type: ACTIVATE_EXCHANGE, exchange }
}

export function deactivateExchange(exchange = false) {
    return { type: DEACTIVATE_EXCHANGE, exchange }
}

export function activateStaff(staff = true) {
    return { type: ACTIVATE_STAFF, staff }
}

export function deactivateStaff(staff = false) {
    return { type: DEACTIVATE_STAFF, staff }
}

export function setCode(code = "") {
    return { type: SET_CODE, code }
}

export function setCombos(combos = []) {
    return { type: SET_COMBOS, combos }
}

export function validationError(errors) {
    return { type: VALIDATION_ERROR, errors };
}

export function activateRefund(refund = true) {
    return { type: ACTIVATE_REFUND, refund }
}

export function deactivateRefund(refund = false) {
    return { type: DEACTIVATE_REFUND, refund }
}

export function setRefund(refundData) {
    return { type: SET_REFUND, refundData }
}
