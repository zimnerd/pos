import { RETRIEVE_PRODUCTS } from "../constants/stock.constants";

export function retrieveProducts(products = []) {
    return { type: RETRIEVE_PRODUCTS, products }
}
