import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from 'app/globalUtils';
import {
    getProductInfoSuccess,
    getProductInfoFailed,
} from './actions';
import { GET_PRODUCT_INFO } from './constants';

export function* worker() {
    const response = yield call(apiRequest, '/postgres/product', 'get');
    console.log(response);
    if (response && response.ok) {
        yield put(getProductInfoSuccess(response));
    } else {
        yield put(getProductInfoFailed(response));
    }
}
export default function* defaultSaga() {
    yield takeLatest(GET_PRODUCT_INFO, worker);
}
