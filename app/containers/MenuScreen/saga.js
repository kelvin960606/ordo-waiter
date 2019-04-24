import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from 'app/globalUtils';
import { globalScope } from 'app/globalScope';
import { AsyncStorage } from 'react-native';
import {
    getProductDataSuccess,
    getProductDataFailed,
} from './actions';
import { GET_PRODUCT_DATA } from './constants';

export function* worker() {
    const response = yield call(AsyncStorage.getItem, 'productData');
    if (response) {
        globalScope.productData = JSON.parse(response);
        yield put(getProductDataSuccess({ success: true, message: 'Data received from async' }));
    } else {
        const response2 = yield call(apiRequest, '/postgres/product', 'get');
        if (response2 && response2.ok) {
            globalScope.productData = response2.data.result.result;
            yield call(AsyncStorage.setItem, 'productData', JSON.stringify(response2.data.result.result));
            yield put(getProductDataSuccess({ success: true, message: 'Data received from API' }));
        } else {
            yield put(getProductDataFailed({ success: false, message: 'Failed to get data from API' }));
        }
    }
}

export default function* defaultSaga() {
    yield takeLatest(GET_PRODUCT_DATA, worker);
}
