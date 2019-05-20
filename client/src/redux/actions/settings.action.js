import { RETRIEVE_SHOP_DETAILS, RETRIEVE_TILL_DETAILS } from "../constants/settings.constants";

export function retrieveShop(shop = {}) {
    return { type: RETRIEVE_SHOP_DETAILS, shop };
}

export function retrieveTill(till = {}) {
    return { type: RETRIEVE_TILL_DETAILS, till };
}
