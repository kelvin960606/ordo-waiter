/**
 *
 * CartScreen
 *
 */

import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PriceTag from 'components/PriceTag';
import { getXdp, dataChecking } from 'app/globalUtils';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCartScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class CartScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    renderItemInCart = ({ item, index }) => {
        const { currentCartData } = this.props;

        if (!currentCartData[item.id]) {
            return null;
        }

        return (
            <View className="cart-product-item" key={`${index}`} style={{ padding: getXdp(1.5) }}>
                <Text style={{ fontSize: getXdp(2.5) }}>{item.product_code}</Text>
                <Text style={{ fontSize: getXdp(2.5), fontWeight: 'bold' }}>{item.product_name}</Text>
                {
                    currentCartData[item.id].items.map((item2, index2) => (
                        <View key={index2} style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ fontSize: getXdp(2.5) }}>
                                {
                                    item2.topping ?
                                        `- ${item2.topping.map((topping, toppingIndex) => `${JSON.stringify(topping)}${toppingIndex !== item2.topping.length - 1 ? ', ' : ''}`)}`
                                        // `- ${item2.topping.map((topping, toppingIndex) => `${topping.toppingText}${toppingIndex !== item2.topping.length - 1 ? ', ' : ''}`)}`
                                        :
                                        '- Default'
                                }
                            </Text>
                            <PriceTag value={10} style={{ padding: getXdp(0.6), fontSize: getXdp(1.9), color: 'darkgray' }} />
                        </View>
                    ))
                }
                <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
            </View>
        );
    };

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
                <View
                    style={{
                        position: 'absolute',
                        left: getXdp(30),
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: 'white',
                        zIndex: 2000,
                    }}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                        <TouchableOpacity onPress={this.props.toggle}>
                            <Text>
                                <Image source={require('../../assets/images/collapse.png')} style={{ width: getXdp(3.5), height: getXdp(3.5), padding: getXdp(1), marginRight: getXdp(2) }} />
                                <Text style={{ fontSize: getXdp(3.5), fontWeight: 'bold', color: 'tomato' }}>Cart</Text>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.props.onCancelOrder}
                        >
                            <Text style={{ fontSize: getXdp(2.5), color: 'tomato', paddingTop: getXdp(1) }}>Cancel Order</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                    <View
                        className="cart-product-list"
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}
                    >
                        {
                            dataChecking(this.props, 'currentCartData') &&
                                <FlatList
                                    numColumns={1}
                                    data={globalScope.productData || []}
                                    renderItem={this.renderItemInCart}
                                    keyExtractor={(item, index) => `${index}`}
                                />
                        }
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                        <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                        <View style={{ backgroundColor: 'lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                            <Text style={{ fontSize: getXdp(2.5) }}>Guest</Text>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Image source={require('../../assets/images/people.png')} style={{ tintColor: 'gray', width: getXdp(3), height: getXdp(3) }} />
                                <Text style={{ fontSize: getXdp(2.5), paddingLeft: getXdp(1) }}>{3}</Text>
                            </View>
                        </View>
                        <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                            <Text style={{ fontSize: getXdp(2.5) }}>New Order</Text>
                            <PriceTag value={10} style={{ fontSize: getXdp(2.5) }} />
                        </View>
                        <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                            <Text style={{ fontSize: getXdp(2.5) }}>Submitted Order</Text>
                            <PriceTag value={39.90} style={{ fontSize: getXdp(2.6), fontWeight: 'bold' }} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: 'tomato', paddingVertical: getXdp(2) }}>
                            <Text style={{ fontSize: getXdp(3), textAlign: 'center', color: 'white' }}>Submit Order</Text>
                        </TouchableOpacity>
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
