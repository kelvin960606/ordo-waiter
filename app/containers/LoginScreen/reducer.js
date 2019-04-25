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
} from './constants';

const initialState = fromJS({
    login: null,
    loading: false,
    error: false,
});

function loginScreenReducer(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}

export default loginScreenReducer;
