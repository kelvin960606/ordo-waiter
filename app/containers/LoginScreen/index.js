/**
 *
 * LoginScreen
 *
 */

import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class LoginScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View>
                <Text>Content</Text>
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
