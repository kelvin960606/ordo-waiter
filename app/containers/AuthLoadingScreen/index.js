/**
 *
 * AuthLoadingScreen
 *
 */

import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthLoadingScreen from './selectors';
import reducer from './reducer';
import saga from './saga';
import { globalScope } from '../../globalScope';

export class AuthLoadingScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.checkAuth();
    }

    // Fetch the token from storage then navigate to our appropriate place
    checkAuth = async () => {
        this.props.navigation.navigate(globalScope.token ? 'App' : 'Auth');
    };

    render() {
        return (
            <SafeAreaView>
                <Text>Auth Loading</Text>
            </SafeAreaView>
        );
    }
}

AuthLoadingScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    authloadingscreen: makeSelectAuthLoadingScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'authLoadingScreen', reducer });
const withSaga = injectSaga({ key: 'authLoadingScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(AuthLoadingScreen);
