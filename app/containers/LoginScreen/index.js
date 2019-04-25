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
                        await AsyncStorage.setItem('ordo_token', 'aab61087-2771-4b47-89cb-a55e217dca63');
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
