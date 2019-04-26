/*
 *
 * LoginScreen reducer
 *
 */

import { fromJS } from 'immutable';
import {
    STAFF_LOGIN,
    STAFF_LOGIN_SUCCESS,
    STAFF_LOGIN_FAILED,
    GET_MERCHANT_DATA,
    GET_MERCHANT_DATA_SUCCESS,
    GET_MERCHANT_DATA_FAILED,
    INIT,
} from './constants';

const initialState = fromJS({
    login: null,
    mData: null,
    loading: false,
    error: false,
});

function loginScreenReducer(state = initialState, action) {
    switch (action.type) {
        case INIT:
            return state
                .set('loading', false)
                .set('login', null)
                .set('error', false)
                .set('mData', null);
        case STAFF_LOGIN:
            return state
                .set('loading', true)
                .set('error', false);
        case STAFF_LOGIN_SUCCESS:
            return state
                .set('loading', false)
                .set('login', action.payload)
                .set('error', false);
        case STAFF_LOGIN_FAILED:
            return state
                .set('loading', false)
                .set('login', action.payload)
                .set('error', action.payload);
        case GET_MERCHANT_DATA:
            return state
                .set('loading', true)
                .set('error', false);
        case GET_MERCHANT_DATA_SUCCESS:
            return state
                .set('loading', false)
                .set('mData', action.payload)
                .set('error', false);
        case GET_MERCHANT_DATA_FAILED:
            return state
                .set('loading', false)
                .set('mData', action.payload)
                .set('error', action.payload);
        default:
            return state;
    }
}

export default loginScreenReducer;
