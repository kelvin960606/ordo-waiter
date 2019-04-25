import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from '../../globalUtils';
import { staffLoginFailed, staffLoginSuccess } from './actions';
import { STAFF_LOGIN } from './constants';

export function* trigger(action) {
    const body = {
        qr: action.payload.qr,
        pin: action.payload.pin,
    };
    const response = yield call(apiRequest, '/employee/login', 'post', body);
    if (response && response.ok) {
        yield put(staffLoginSuccess(response.data));
    } else {
        yield put(staffLoginFailed(response.data));
    }
    alert(JSON.stringify(response.data));
}
export default function* defaultSaga() {
    yield takeLatest(STAFF_LOGIN, trigger);
}
