/*
 *
 * MyAppScreen actions
 *
 */

import {
    GET_PRODUCT_INFO,
    GET_PRODUCT_INFO_SUCCESS,
    GET_PRODUCT_INFO_FAILED,
} from './constants';

export function getProductInfo() {
    return {
        type: GET_PRODUCT_INFO,
    };
}

export function getProductInfoSuccess(payload) {
    return {
        type: GET_PRODUCT_INFO_SUCCESS,
        data: payload.data,
    };
}

export function getProductInfoFailed(payload) {
    return {
        type: GET_PRODUCT_INFO_FAILED,
        data: payload.data,
    };
}
