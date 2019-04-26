/**
 *
 * LoginScreen
 *
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { getXdp, dataChecking } from 'app/globalUtils';
import { globalScope } from 'app/globalScope';
import { RNCamera } from 'react-native-camera';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginScreen from './selectors';
import reducer from './reducer';
import saga from './saga';
import { staffLogin, getMerchantData, init } from './actions';
export class LoginScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {
        show: false,
        qr: '',
        form: false,
        pin: '',
    }

    componentDidMount() {
        this.props.dispatch(init());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loginscreen !== this.props.loginscreen) {
            if (nextProps.loginscreen.login !== this.props.loginscreen.login) {
                if (dataChecking(nextProps.loginscreen, 'login', 'success') && !nextProps.loginscreen.loading) {
                    this.setToken(nextProps.loginscreen.login.result.token);
                    this.props.dispatch(getMerchantData(nextProps.loginscreen.login.result.id));
                }
            }
            if (nextProps.loginscreen.mData !== this.props.loginscreen.mData) {
                if (dataChecking(nextProps.loginscreen.mData, 'result')) {
                    globalScope.config = nextProps.loginscreen.mData.result;
                    globalScope.merchantId = nextProps.loginscreen.mData.result.merchantId;
                    globalScope.storeId = nextProps.loginscreen.mData.result.storeId;
                    this.props.navigation.navigate('AuthLoading');
                }
            }
        }
    }

    setToken = async (token) => {
        globalScope.token = token;
        await AsyncStorage.setItem('ordo_token', token);
    }

    barcodeReceived = (e) => {
        this.setState({ qr: e, form: true });
    }

    render() {
        return (
            <View style={{ flex: 1, margin: 20 }}>
                <Text style={{ paddingVertical: 30, fontSize: getXdp(5), fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to Ordo
                </Text>
                <TouchableOpacity
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        backgroundColor: '#E89558',
                        margin: 20,
                        borderRadius: 15,
                    }}
                    onPress={() => {
                        this.setState({ show: true });
                    }}
                >
                    <Text style={{ textAlign: 'center', fontSize: getXdp(3), fontWeight: 'bold', color: 'white' }}>Login with QR</Text>
                </TouchableOpacity>
                {
                    this.state.show &&
                        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                            <View style={{ backgroundColor: 'red' }}>
                                <TouchableOpacity onPress={() => this.setState({ show: false })} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'white', fontSize: 30 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <RNCamera
                                style={{ flex: 1 }}
                                type={RNCamera.Constants.Type.back}
                                barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                                flashMode={RNCamera.Constants.FlashMode.auto}
                                onBarCodeRead={(e) => this.barcodeReceived(e)}
                            />
                        </View>

                }
                {
                    this.state.form &&
                        <View style={{backgroundColor: 'grey', flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                            <View style={{ backgroundColor: 'red' }}>
                                <TouchableOpacity onPress={() => this.setState({ form: false })} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'white', fontSize: 30 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text>Pin </Text>
                                <TextInput onChangeText={(value) => this.setState({ pin: value })} style={{ backgroundColor: '#FFCC99', padding: 5, fontSize: getXdp(2.5), borderRadius: 5 }} />
                            </View>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 20,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#E89558',
                                    margin: 20,
                                    borderRadius: 15,
                                }}
                                onPress={() => {
                                    this.props.dispatch(staffLogin(this.state.qr, this.state.pin));
                                }}
                            >
                                <Text style={{ textAlign: 'center', fontSize: getXdp(3), fontWeight: 'bold', color: 'white' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>

                }
                {
                    this.props.loginscreen.loading ?
                        <View style={{ backgroundColor: 'gray', flex: 1, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                        : null
                }
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
