/*
 *
 * MenuScreen reducer
 *
 */

import { fromJS } from 'immutable';
import { dataChecking } from 'app/globalUtils';
import {
    GET_PRODUCT_DATA,
    GET_PRODUCT_DATA_SUCCESS,
    GET_PRODUCT_DATA_FAILED,
} from './constants';

const initialState = fromJS({});

function menuScreenReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PRODUCT_DATA:
            return state;
        case GET_PRODUCT_DATA_SUCCESS:
        case GET_PRODUCT_DATA_FAILED:
            return state
                .set('getProductSuccess', dataChecking(action, 'payload', 'success'))
                .set('getProductReturnMessage', dataChecking(action, 'payload', 'message'));
        default:
            return state;
    }
}

export default menuScreenReducer;
