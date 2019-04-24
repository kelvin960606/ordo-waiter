/**
 *
 * CartScreen
 *
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PriceTag from 'components/PriceTag';
import { getXdp } from 'app/globalUtils';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCartScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class CartScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        // if (nextProps.visible !== this.props.vislble) {
        //     this.setState({
        //         visible: nextProps.visible,
        //     });
        // }
    }

    render() {
        if (!this.props.visible) {
            return null;
        }

        return (
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        opacity: 0.5,
                        backgroundColor: 'red',
                        zIndex: 1000,
                    }}
                >
                    <TouchableOpacity
                        onPress={this.props.toggle}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: '#000000',
                            opacity: 0.5,
                            zIndex: 1000,
                        }}
                    />
                </View>
                <View
                    style={{
                        position: 'absolute',
                        left: getXdp(30),
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: 'white',
                        zIndex: 2000,
                        padding: getXdp(2),
                    }}
                >
                    <View>
                        <Text style={{ color: 'tomato', float: 'left' }}>Cart</Text>
                        <Text style={{ color: 'tomato', float: 'right' }}>Cancel Order</Text>
                    </View>
                    <View className="cart-product-list">
                        {
                            [{}, {}, {}].map((product, productIndex) => (
                                <View className="cart-product-item">
                                    <Text>key</Text>
                                    <Text>Product name</Text>
                                    {
                                        [{}, {}].map((item, index) => (
                                            <View>
                                                <Text>
                                                    {
                                                        item.topping && item.topping.length ?
                                                            `- ${[{}, {}].map((topping, toppingIndex) => 'less spicy, ')}`
                                                            :
                                                            '- Default'
                                                    }
                                                </Text>
                                                <PriceTag value={10} />
                                            </View>
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </View>
                    <View>
                        <Text>Guest</Text>
                        <View>
                            <Image source={require('../../assets/images/people.png')} style={{ tintColor: 'gray', width: getXdp(4), height: getXdp(4) }} />
                            <Text>{3}</Text>
                        </View>
                    </View>
                    <View>
                        <Text>New Order</Text>
                        <PriceTag value={10} />
                    </View>
                    <View>
                        <Text>Submitted Order</Text>
                        <PriceTag value={39.90} />
                    </View>
                </View>
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
