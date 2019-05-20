import { RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export function retrieveProducts(page = {}) {
    return { type: RETRIEVE_PRODUCTS, page }
}
