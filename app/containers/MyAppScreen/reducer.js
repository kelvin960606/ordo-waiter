/*
 *
 * MyAppScreen reducer
 *
 */

import { fromJS } from 'immutable';
import {
    GET_PRODUCT_INFO,
    GET_PRODUCT_INFO_SUCCESS,
    GET_PRODUCT_INFO_FAILED,
} from './constants';

const initialState = fromJS({});

function myAppScreenReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PRODUCT_INFO:
            return state;
        case GET_PRODUCT_INFO_SUCCESS:
            return state;
        case GET_PRODUCT_INFO_FAILED:
            return state;
        default:
            return state;
    }
}

export default myAppScreenReducer;
