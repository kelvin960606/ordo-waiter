/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './app/configureStore';

const store = configureStore();
export default function App() {
    return (
        <Provider store={store}>
        </Provider>

    );
}
