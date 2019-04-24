/**
 *
 * LoginScreen
 *
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class LoginScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View style={{ margin: 20 }}>
                <Text style={{ paddingVertical: 30, fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to Ordo
                </Text>
                <View style={{ margin: 10 }}>
                    <Text>Username: </Text>
                    <TextInput style={{ backgroundColor: '#FFCC99', padding: 5, fontSize: 16, borderRadius: 5 }}></TextInput>
                </View>
                <View style={{ margin: 10 }}>
                    <Text>Password: </Text>
                    <TextInput secureTextEntry={true} style={{ backgroundColor: '#FFCC99', padding: 5, fontSize: 16, borderRadius: 5 }}></TextInput>
                </View>
                <TouchableOpacity
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        backgroundColor: '#E89558',
                        margin: 20,
                        borderRadius: 15,
                    }}
                    onPress={async () => {
                        await AsyncStorage.setItem('ordo_token', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU1NTA0MDkwMCwiZXhwIjoxNTU1MDQ0NTAwLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1qZjkydEBhbGxkZXItNjg3ZDAuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1qZjkydEBhbGxkZXItNjg3ZDAuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJFMW5yYlJqY3hsWXd4WjZKeWpNNkFIWFJOQVEyIn0.GYrsq26IrKgw52WjRSDQAApCKGMWOq4Tm8nMiFf7OnGv3qm7mtTuBfx_Dc3ZBDgQfepHuGlUJk2OlADkm7Ve2BB7SDb49u3pnEWBhmPAaSgJLeva0d035FcwBd4N1RyvcYWRkdNtXAueoPrAc2wjrKvMw7X4YQgg6niKSXfgwZ5oeEvl8Dim8b2gdzyv1X515OB5O7wZfi5OmRBH1oP3wPPnLJhwdyh7bPS7FSGVIiDJhEFLMUbXMhgT-dF9yAufPhmEqybmjnhU8G-5VylrfIBM5GS3OlzowG1bODIVEVWgWNoZPsrPnXvYoYrbyhdf849UgSWgaf9RDDY8UbVraA');
                        this.props.navigation.navigate('AuthLoading');
                    }}
                >
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white' }}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

LoginScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    loginscreen: makeSelectLoginScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginScreen', reducer });
const withSaga = injectSaga({ key: 'loginScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(LoginScreen);
