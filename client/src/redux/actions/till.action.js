import {
    ACTIVATE_LAY_BYE,
    ACTIVATE_RETURNS,
    ADD_LINE_ITEM,
    DEACTIVATE_LAY_BYE,
    DEACTIVATE_RETURNS
} from "../constants/till.constants";

export function activateLayBye(activate = true) {
    return { type: ACTIVATE_LAY_BYE, activate }
}

export function deactivateLayBye(activate = false) {
    return { type: DEACTIVATE_LAY_BYE, activate }
}

export function addLineItem(transactions = []) {
    return { type: ADD_LINE_ITEM, transactions }
}

export function activateReturns(returns = {}) {
    return { type: ACTIVATE_RETURNS, returns }
}

export function deactivateReturns(returns = undefined) {
    return { type: DEACTIVATE_RETURNS, returns }
}
