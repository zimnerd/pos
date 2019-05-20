import { RETRIEVE_SHOP_DETAILS } from "../constants/settings.constants";

export function retrieveShop(shop = {}) {
    return { type: RETRIEVE_SHOP_DETAILS, shop };
}

