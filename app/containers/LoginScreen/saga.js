import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from '../../globalUtils';
import { staffLoginFailed, staffLoginSuccess } from './actions';
import { STAFF_LOGIN } from './constants';

export function* trigger(action) {
    alert(JSON.stringify(action));
    const body = {};
    const response = yield call(apiRequest, '/employee/login', 'post', body);
    if (response && response.ok) {
        yield put(staffLoginSuccess(response.data));
    } else {
        yield put(staffLoginFailed(response.data));
    }
}
export default function* defaultSaga() {
    yield takeLatest(STAFF_LOGIN, trigger);
}
