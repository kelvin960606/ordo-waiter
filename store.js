import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducers from './app/redux/index';
import runSaga from './app/saga/index';
import loginSaga from './app/saga/loginSaga';

export default () => {
    const sagaMiddleware = createSagaMiddleware()
    // mount it on the Store
    const store = createStore(
      reducers,
      applyMiddleware(sagaMiddleware)
    )
    // then run the saga
    runSaga(sagaMiddleware);

    return store;
}

