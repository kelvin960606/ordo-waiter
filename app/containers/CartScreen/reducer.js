/*
 *
 * CartScreen reducer
 *
 */

import { fromJS } from 'immutable';
import {
    GET_CART_DATA,
    GET_CART_DATA_SUCCESS,
    GET_CART_DATA_FAILED,
    CREATE_ORDER,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILED,
} from './constants';

const initialState = fromJS({});

function cartScreenReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CART_DATA:
            return state
                .set('checkoutInfo', null)
                .set('getCartLoading', true)
                .set('getCartMessage', null);
        case GET_CART_DATA_SUCCESS:
        case GET_CART_DATA_FAILED:
            return state
                .set('checkoutInfo', action.payload.data)
                .set('getCartLoading', false)
                .set('getCartMessage', action.payload.message);
        case CREATE_ORDER:
            return state
                .set('orderInfo', null)
                .set('createOrderLoading', true)
                .set('createOrderMessage', null);
        case CREATE_ORDER_SUCCESS:
        case CREATE_ORDER_FAILED:
            return state
                .set('orderInfo', action.payload.data)
                .set('createOrderLoading', false)
                .set('createOrderMessage', action.payload.message);
        default:
            return state;
    }
}

export default cartScreenReducer;
