/*
 *
 * LoginScreen actions
 *
 */

import {
    STAFF_LOGIN,
    STAFF_LOGIN_FAILED,
    STAFF_LOGIN_SUCCESS,
} from './constants';

export function staffLogin(params) {
    return {
        type: STAFF_LOGIN,
        payload: params,
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
