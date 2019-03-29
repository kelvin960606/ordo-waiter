import { call, put, takeLatest } from 'redux-saga/effects';
import { apiRequest } from '../../globalUtils';
import { defaultAction } from './actions';
import { DEFAULT_ACTION } from './constants';

export function* trigger() {
    const response = yield call(apiRequest, '', 'get');
    if (response && response.ok) {
        yield put(defaultAction(response));
    } else {
        yield put(defaultAction(response));
    }
}
export default function* defaultSaga() {
    yield takeLatest(DEFAULT_ACTION, trigger);
}
