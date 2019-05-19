import { ACTIVATE_LAY_BYE, ADD_LINE_ITEM, DEACTIVATE_LAY_BYE } from "../constants/till.constants";

export function activateLayBye(activate = true) {
    return { type: ACTIVATE_LAY_BYE, activate }
}

export function deactivateLayBye(activate = false) {
    return { type: DEACTIVATE_LAY_BYE, activate }
}

export function addLineItem(transactions = []) {
    return { type: ADD_LINE_ITEM, transactions }
}
