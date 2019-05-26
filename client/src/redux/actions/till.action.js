import {
    ACTIVATE_LAY_BYE,
    ACTIVATE_RETURNS,
    SET_TRANSACTIONS,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_RETURNS, RESET_TOTALS, RESET_TRANSACTIONS,
    SET_TOTALS, SET_TRANSACTION_ID
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
