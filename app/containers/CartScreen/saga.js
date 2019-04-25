import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from 'app/globalUtils';
import {
    GET_CART_DATA,
    CREATE_ORDER,
} from './constants';
import {
    getCartDataSuccess,
    getCartDataFailed,
    createOrderSuccess,
    createOrderFailed,
} from './actions';

export function* triggerGetCart(action) {
    const response = yield call(apiRequest, '/store/balance', 'post', action.requestBody);
    console.log({ balanceRes: response });
    if (response && response.ok) {
        yield put(getCartDataSuccess({ data: response.data.result, mesage: 'Get getCartData success' }));
    } else {
        yield put(getCartDataFailed({ data: null, message: 'Get POST getCartData failed' }));
    }
}

export function* triggerCreateOrder(action) {
    const response = yield call(apiRequest, '/store/order', 'post', action.requestBody);
    console.log({ createOrderRes: response });
    if (response && response.ok) {
        yield put(createOrderSuccess({ data: response.data.result, mesage: 'POST createOrder success' }));
    } else {
        yield put(createOrderFailed({ data: null, message: 'Get POST createOrder failed' }));
    }
}

export default function* defaultSaga() {
    yield takeLatest(GET_CART_DATA, triggerGetCart);
    yield takeLatest(CREATE_ORDER, triggerCreateOrder);
}
