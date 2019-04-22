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

export function getProductInfoSuccess() {
    return {
        type: GET_PRODUCT_INFO_SUCCESS,
    };
}

export function getProductInfoFailed() {
    return {
        type: GET_PRODUCT_INFO_FAILED,
    };
}
