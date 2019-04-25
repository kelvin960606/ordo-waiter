import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from 'app/globalUtils';
import {
    GET_CART_DATA,
} from './constants';
import {
    getCartDataSuccess,
    getCartDataFailed,
} from './actions';

export function* trigger(action) {
    const response = yield call(apiRequest, '/store/balance', 'post', { store: 1, products: action.requestBody });
    // console.log({ response });
    if (response && response.ok) {
        yield put(getCartDataSuccess({ data: response.data.result, mesage: 'Get API data success' }));
    } else {
        yield put(getCartDataFailed({ data: null, message: 'Get API data failed' }));
    }
}
export default function* defaultSaga() {
    yield takeLatest(GET_CART_DATA, trigger);
}
