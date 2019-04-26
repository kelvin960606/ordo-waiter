/*
 *
 * LoginScreen actions
 *
 */

import {
    STAFF_LOGIN,
    STAFF_LOGIN_FAILED,
    STAFF_LOGIN_SUCCESS,
    GET_MERCHANT_DATA,
    GET_MERCHANT_DATA_SUCCESS,
    GET_MERCHANT_DATA_FAILED,
    INIT,
} from './constants';


export function init() {
    return {
        type: INIT,
    };
}

export function staffLogin(qr, pin) {
    return {
        type: STAFF_LOGIN,
        payload: {
            qr,
            pin,
        },
    };
}

export function staffLoginSuccess(params) {
    return {
        type: STAFF_LOGIN_SUCCESS,
        payload: params,
    };
}

export function staffLoginFailed(params) {
    return {
        type: STAFF_LOGIN_FAILED,
        payload: params,
    };
}

export function getMerchantData(params) {
    return {
        type: GET_MERCHANT_DATA,
        id: params,
    };
}

export function getMerchantDataSuccess(params) {
    return {
        type: GET_MERCHANT_DATA_SUCCESS,
        payload: params,
    };
}

export function getMerchantDataFailed(params) {
    return {
        type: GET_MERCHANT_DATA_FAILED,
        payload: params,
    };
}
