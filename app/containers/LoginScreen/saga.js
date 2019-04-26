import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest, dataChecking } from '../../globalUtils';
import { staffLoginFailed, staffLoginSuccess, getMerchantDataSuccess, getMerchantDataFailed } from './actions';
import { STAFF_LOGIN, GET_MERCHANT_DATA } from './constants';
import { globalScope } from 'app/globalScope';

export function* triggerLogin(action) {
    const body = {
        qr: action.payload.qr.data,
        pin: action.payload.pin,
    };
    const response = yield call(apiRequest, '/employee/login', 'post', body);
    if (response && response.ok) {
        yield put(staffLoginSuccess(response.data));
    } else {
        yield put(staffLoginFailed(response.data));
        alert(JSON.stringify(response.data));
    }
}

export function* triggerMerchantData(action) {
    const response = yield call(apiRequest, `postgres/employee/${action.id}`, 'get');
    if (response && response.ok) {
        yield put(getMerchantDataSuccess(response.data));
    } else {
        yield put(getMerchantDataFailed(response.data));
        alert(JSON.stringify(response.data));
    }
}
export default function* defaultSaga() {
    yield takeLatest(STAFF_LOGIN, triggerLogin);
    yield takeLatest(GET_MERCHANT_DATA, triggerMerchantData);
}
