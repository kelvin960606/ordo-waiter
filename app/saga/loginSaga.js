import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { loginRequestFailed,loginRequestSuccess, LOGIN_REQUEST } from '../redux/loginRedux';

function* doLogin(action) {
  alert('triggered saga');
}

export default function* loginSaga() {
  yield takeEvery(LOGIN_REQUEST, doLogin);
}