import { fork } from 'redux-saga/effects'
import loginSaga from './loginSaga'

const sagas = [
    loginSaga,
];

export default runSaga = (sagaMiddleware) => {
    sagas.forEach((element) => {
        sagaMiddleware.run(element)
    });
};