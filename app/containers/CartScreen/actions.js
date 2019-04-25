/*
 *
 * CartScreen actions
 *
 */

import {
    GET_CART_DATA,
    GET_CART_DATA_SUCCESS,
    GET_CART_DATA_FAILED,
    CREATE_ORDER,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILED,
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


export function createOrder(requestBody) {
    return {
        type: CREATE_ORDER,
        requestBody,
    };
}

export function createOrderSuccess(payload) {
    return {
        type: CREATE_ORDER_SUCCESS,
        payload,
    };
}

export function createOrderFailed(payload) {
    return {
        type: CREATE_ORDER_FAILED,
        payload,
    };
}