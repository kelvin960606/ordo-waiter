import { fromJS } from 'immutable';
/*
 * Constant
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'

/*
 * Action
 */

export function loginRequest(params) {
    return {
        type: LOGIN_REQUEST,
        payload: params,
    };
}

export function loginRequestSuccess(params) {
    return {
        type: LOGIN_REQUEST,
        payload: params,
    };
}

export function loginRequestFailed(params) {
    return {
        type: LOGIN_REQUEST,
        payload: params,
    };
}

/*
 * Reducer
 */

const initialState = fromJS({
    loading: false,
    error: false,
    data: {},
});

function loginScreenReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return state
                .set('loading', true);
        case LOGIN_SUCCESS:
            return state
                .set('loading', false)
                .set('error', false)
                .set('data', action.payload);
        case LOGIN_FAILED:
            return state
                .set('loading', false)
                .set('error', true)
                .set('data', action.payload);
        default:
            return state;
    }
  }

  export default loginScreenReducer;
