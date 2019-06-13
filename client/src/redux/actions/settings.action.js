import {
    RETRIEVE_HADDITH,
    RETRIEVE_SHOP_DETAILS,
    RETRIEVE_TILL_DETAILS,
    SAVE_TILL_DETAILS
} from "../constants/settings.constants";

export function retrieveShop(shop = {}) {
    return { type: RETRIEVE_SHOP_DETAILS, shop };
}

export function retrieveTill(till = {}) {
    return { type: RETRIEVE_TILL_DETAILS, till };
}

export function saveTill(till = {}) {
    return { type: SAVE_TILL_DETAILS, till };
}

export function retrieveHaddith(haddith = {}) {
    return { type: RETRIEVE_HADDITH, haddith };
}
