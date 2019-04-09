/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'babel-polyfill';
import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './app/configureStore';
import AppNavigator from './app/navigation/AppNavigator';

const store = configureStore();
export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>

    );
}
