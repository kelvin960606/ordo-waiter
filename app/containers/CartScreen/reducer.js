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
            console.log(action.payload.data);
            return state
                .set('checkoutInfo', action.payload.data)
                .set('getCartLoading', false)
                .set('getCartMessage', action.payload.message);
        default:
            return state;
    }
}

export default cartScreenReducer;
