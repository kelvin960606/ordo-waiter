/**
 *
 * CartScreen
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
import makeSelectCartScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class CartScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <View>
                <Text>cartscreen</Text>
            </View>
        );
    }
}

CartScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    cartscreen: makeSelectCartScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'cartScreen', reducer });
const withSaga = injectSaga({ key: 'cartScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(CartScreen);
