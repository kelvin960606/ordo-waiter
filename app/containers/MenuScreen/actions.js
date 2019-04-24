/*
 *
 * MenuScreen actions
 *
 */

import {
    GET_PRODUCT_DATA,
    GET_PRODUCT_DATA_SUCCESS,
    GET_PRODUCT_DATA_FAILED,
} from './constants';

export function getProductData() {
    return {
        type: GET_PRODUCT_DATA,
    };
}

export function getProductDataSuccess(payload) {
    return {
        type: GET_PRODUCT_DATA_SUCCESS,
        payload,
    };
}

export function getProductDataFailed(payload) {
    return {
        type: GET_PRODUCT_DATA_FAILED,
        payload,
    };
}
