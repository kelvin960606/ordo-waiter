/*
 *
 * CartScreen actions
 *
 */

import {
    GET_CART_DATA,
    GET_CART_DATA_SUCCESS,
    GET_CART_DATA_FAILED,
} from './constants';

export function getCartData(requestBody) {
    return {
        type: GET_CART_DATA,
        requestBody,
    };
}

export function getCartDataSuccess(payload) {
    return {
        type: GET_CART_DATA_SUCCESS,
        payload,
    };
}

export function getCartDataFailed(payload) {
    return {
        type: GET_CART_DATA_FAILED,
        payload,
    };
}
