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
import { getXdp } from 'app/globalUtils';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class LoginScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View style={{ margin: 20 }}>
                <Text style={{ paddingVertical: 30, fontSize: getXdp(5), fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to Ordo
                </Text>
                <View style={{ margin: 10 }}>
                    <Text>Username: </Text>
                    <TextInput style={{ backgroundColor: '#FFCC99', padding: 5, fontSize: getXdp(2.5), borderRadius: 5 }}></TextInput>
                </View>
                <View style={{ margin: 10 }}>
                    <Text>Password: </Text>
                    <TextInput secureTextEntry={true} style={{ backgroundColor: '#FFCC99', padding: 5, fontSize: getXdp(2.5), borderRadius: 5 }}></TextInput>
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
                        await AsyncStorage.setItem('ordo_token', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU1NTA0MDk4MiwiZXhwIjoxNTU1MDQ0NTgyLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1qZjkydEBhbGxkZXItNjg3ZDAuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1qZjkydEBhbGxkZXItNjg3ZDAuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJieU1nOG5pRGZCZGFwOEswNWpBV2MyNm93U0ozIn0.Qs6N_i3byJ4lnzxlvlQojgZcAekMmm9oN_W85d1BkL4lSBdihQhdZxIxqPyyQkrJAFz-IwrrTZTOmbDJfg7FPiiYFhRIUOKlJ1W_L0-x_nb3gA1Krupiq9bSP0J7kCAC-wGbLsi365P3xwP1GxlAHDLt7MBZOYDZZdEaiqyuYgof8L4Mr-tvfcJbSN8e_ys6cRcyFVqu-SptkgtT7ln2uuTrOEoCrSfuSBuIG2-1IBpYMGySaGQ7DYpO3pOMOfikJdZJqDkMKU--ba8AdbGBeXucVk0hHY0-KWTafHaOqh423XlbYFecWS4q-82VBtjTY16yifN4c2dzNI9eIRJw9w');
                        this.props.navigation.navigate('AuthLoading');
                    }}
                >
                    <Text style={{ textAlign: 'center', fontSize: getXdp(3), fontWeight: 'bold', color: 'white' }}>Login</Text>
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
