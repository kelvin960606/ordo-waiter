/*
 *
 * MyAppScreen reducer
 *
 */

import { fromJS } from 'immutable';
import {
    DEFAULT_ACTION,
} from './constants';

const initialState = fromJS({});

function myAppScreenReducer(state = initialState, action) {
    switch (action.type) {
        case DEFAULT_ACTION:
            return state;
        default:
            return state;
    }
}

export default myAppScreenReducer;
