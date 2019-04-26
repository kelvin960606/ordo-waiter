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
import { getXdp, getYdp, dataChecking } from 'app/globalUtils';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCartScreen from './selectors';
import { getCartData, createOrder } from './actions';
import reducer from './reducer';
import saga from './saga';

export class CartScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {
        guestNum: 0,
    };

    componentWillReceiveProps(nextProps) {
        // to dispatch getCartData when turn visible
        if (nextProps.visible && nextProps.visible !== this.props.visible) {
            this.props.dispatch(getCartData({
                store: 1,
                products: this.props.currentCartData,
            }));
        }

        // handling for get checkoutInfo
        if (nextProps.cartscreen.checkoutInfo && nextProps.cartscreen.checkoutInfo !== this.props.cartscreen.checkoutInfo) {
            this.setState({
                checkoutInfo: dataChecking(nextProps, 'cartscreen', 'checkoutInfo'),
            });
        }

        if (nextProps.cartscreen.getCartLoading !== this.props.cartscreen.getCartLoading) {
            this.setState({
                getCartLoading: nextProps.cartscreen.getCartLoading,
            });
        }
        if (nextProps.cartscreen.createOrderLoading !== this.props.cartscreen.createOrderLoading) {
            this.setState({
                createOrderLoading: nextProps.cartscreen.createOrderLoading,
            });
        }

        if (nextProps.cartscreen.getCartMessage &&
                nextProps.cartscreen.getCartMessage !== this.props.cartscreen.getCartMessage) {
            alert(nextProps.cartscreen.getCartMessage);
        }
        if (nextProps.cartscreen.createOrderMessage &&
                nextProps.cartscreen.createOrderMessage !== this.props.cartscreen.createOrderMessage) {
            alert(nextProps.cartscreen.createOrderMessage);

            if (nextProps.cartscreen.createOrderSuccess) {
                this.props.onCloseMenu();
            }
        }
    }

    onCreateOrder = (isLoading) => {
        if (isLoading) {
            return;
        }

        if (!this.state.guestNum) {
            this.setState({ showSelectPax: true });
            return;
        }
        // console.log({ props: this.props, state: this.state });
        this.props.dispatch(createOrder({
            store: globalScope.storeId,
            merchant: globalScope.merchantId,
            pax: this.state.guestNum,
            table: this.props.currentTableData.key,
            products: this.props.currentCartData,
        }, dataChecking(this.props.currentTableData, 'data', 'status', 'dining')));
    }

    managePaxCount = ({ value }) => {
        if (value < 0 || value > this.props.currentTableData.data.status.pax) {
            return;
        }

        this.setState({
            guestNum: value,
        });
    }

    renderSelectPaxModal = () => {
        if (!this.state.showSelectPax) {
            return null;
        }
        const { currentTableData } = this.props;
        const { guestNum } = this.state;

        return (
            <View
                style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2000,
                    position: 'absolute' }}
            >
                <TouchableOpacity
                    className="select-pax-modal-overlay"
                    onPress={() => this.setState({ showSelectPax: false })}
                    style={{
                        backgroundColor: '#000',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2010,
                        opacity: 0.7,
                    }}
                >
                </TouchableOpacity>
                <View
                    className="select-pax-dialog"
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: getYdp(20),
                        left: getXdp(15),
                        right: getXdp(15),
                        borderRadius: 30,
                        borderWidth: 3,
                        borderColor: '#E89558',
                        zIndex: 2020,
                        paddingVertical: getXdp(5),
                    }}
                >
                    <TouchableOpacity
                        className="close-selec-pax-button"
                        onPress={() => this.setState({ showSelectPax: false })}
                        style={{
                            position: 'absolute',
                            top: getXdp(2),
                            right: getXdp(2),
                            zIndex: 1,
                            padding: getXdp(1),
                        }}
                    >
                        <Image source={require('../../assets/images/close.png')} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: getXdp(3) }}>Number of PAX</Text>
                        <Text style={{ alignSelf: 'center', fontSize: getXdp(2) }}>Max pax for this table: {currentTableData.data.status.pax}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: getXdp(3) }}>
                            <TouchableOpacity
                                style={{ paddingVertical: getXdp(1.5) }}
                                onPress={() => this.managePaxCount({ value: guestNum - 1 })}
                            >
                                <Image
                                    style={{
                                        margin: getXdp(2),
                                        height: getXdp(15),
                                        width: getXdp(15),
                                        tintColor: guestNum ? null : 'lightgray',
                                    }}
                                    source={require('../../assets/images/subtract.png')}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    paddingHorizontal: getXdp(6),
                                    paddingVertical: getXdp(5),
                                    margin: getXdp(2),
                                    fontSize: getXdp(5),
                                    borderColor: 'tomato',
                                    borderWidth: getXdp(0.4),
                                }}
                            >
                                {guestNum}
                            </Text>
                            <TouchableOpacity
                                style={{ paddingVertical: getXdp(1.5) }}
                                onPress={() => this.managePaxCount({ value: guestNum + 1 })}
                            >
                                <Image
                                    style={{
                                        margin: getXdp(2),
                                        height: getXdp(15),
                                        width: getXdp(15),
                                        tintColor: guestNum < currentTableData.data.status.pax ? null : 'lightgray',
                                    }}
                                    source={require('../../assets/images/plus.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                paddingVertical: getXdp(2.5),
                                backgroundColor: '#DDDAFF',
                                borderRadius: 25,
                                marginVertical: getXdp(1),
                                marginHorizontal: getXdp(6),
                            }}
                            onPress={() => this.setState({ showSelectPax: false })}
                        >
                            <Text style={{ fontSize: getXdp(2.5), alignSelf: 'center' }}>Back to cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: getXdp(2.5),
                                backgroundColor: 'tomato',
                                borderRadius: 25,
                                marginVertical: getXdp(1),
                                marginHorizontal: getXdp(6),
                            }}
                            onPress={() => {
                                if (!guestNum) {
                                    alert('Please set pax');
                                }
                                this.onCreateOrder();
                            }}
                        >
                            <Text style={{ fontSize: getXdp(3), textAlign: 'center', color: 'white' }}>
                                Create Order
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    renderItemInCart = ({ item, index }) => (
        <View className="cart-product-item" style={{ padding: getXdp(1.5) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ alignSelf: 'center', fontSize: getXdp(3), paddingRight: getXdp(3) }}>{index + 1}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: getXdp(1.8), color: 'darkgray' }}>{item.code}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: getXdp(2), paddingRight: getXdp(2) }}>{item.name}</Text>
                            <PriceTag value={item.price.product} style={{ fontSize: getXdp(2), color: 'darkgray', alignSelf: 'flex-end' }} />
                        </View>
                        {
                            item.toppings && item.toppings.length ?
                                <View>
                                    {
                                        item.toppings.map((topping, toppingIndex) => (
                                            <View key={`${toppingIndex}`} style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: getXdp(2), paddingRight: getXdp(2) }}>{`- ${topping.code}: ${topping.name}`}</Text>
                                                <PriceTag value={topping.price} style={{ fontSize: getXdp(2), color: 'darkgray' }} />
                                            </View>
                                        ))
                                    }
                                </View>
                                :
                                null
                        }
                    </View>
                </View>
                <View>
                    <PriceTag value={item.price.with_toppings} style={{ padding: getXdp(1), fontSize: getXdp(2.2), textAlign: 'right', alignSelf: 'flex-end' }} />
                </View>
            </View>
            <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2, marginTop: 20 }}></View>
        </View>
    );

    render() {
        const { guestNum } = this.state;
        if (!this.props.visible) {
            return null;
        }

        const isLoading = this.props.cartscreen.getCartLoading || !this.state.checkoutInfo;

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
                {this.renderSelectPaxModal()}
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
                        zIndex: 1010,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                            <TouchableOpacity onPress={this.props.toggle}>
                                <Text>
                                    <Image source={require('../../assets/images/collapse.png')} style={{ width: getXdp(3.5), height: getXdp(3.5), padding: getXdp(1), marginRight: getXdp(2) }} />
                                    <Text style={{ fontSize: getXdp(3.5), fontWeight: 'bold', color: 'tomato' }}>Cart</Text>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.props.onCloseMenu}
                            >
                                <Text style={{ fontSize: getXdp(2.5), color: 'tomato', paddingTop: getXdp(1) }}>Cancel Order</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>

                        {
                            isLoading ?
                                <View style={{ flex: 1 }}>
                                    <Image style={{ alignSelf: 'center', width: getXdp(50), height: getXdp(50) }} source={require('../../assets/images/loading.gif')} />
                                </View>
                                :
                                <View
                                    className="cart-product-list"
                                    style={{ padding: getXdp(1.5) }}
                                >
                                    {
                                        dataChecking(this.state, 'checkoutInfo', 'orders') &&
                                            <FlatList
                                                style={{ height: getYdp(70) }}
                                                numColumns={1}
                                                data={this.state.checkoutInfo.orders || []}
                                                renderItem={this.renderItemInCart}
                                                keyExtractor={(item, index) => `${index}`}
                                                ListFooterComponent={() => <View style={{ height: getYdp(5) }} />}
                                            />
                                    }
                                </View>
                        }
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                            <View style={{ backgroundColor: 'lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                                <Text style={{ fontSize: getXdp(2.5) }}>Guest</Text>
                                <TouchableOpacity
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                    onPress={() => this.setState({ showSelectPax: true })}
                                >
                                    <Image source={require('../../assets/images/people.png')} style={{ tintColor: 'gray', width: getXdp(3), height: getXdp(3) }} />
                                    <Text style={{ fontSize: getXdp(2.5), paddingLeft: getXdp(1) }}>
                                        {JSON.stringify(guestNum)}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="section-seperator" style={{ backgroundColor: 'lightgray', height: 2 }}></View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: getXdp(1.5) }}>
                                <Text style={{ fontSize: getXdp(2.5) }}>Total Order</Text>
                                {
                                    isLoading && !dataChecking(this.state, 'checkoutInfo', 'payment', 'total') ?
                                        <Text style={{ fontSize: getXdp(2.6), fontWeight: 'bold' }} >Calculating...</Text>
                                        :
                                        <PriceTag value={this.state.checkoutInfo.payment.total} style={{ fontSize: getXdp(2.6), fontWeight: 'bold' }} />
                                }
                            </View>
                            <TouchableOpacity
                                style={{ backgroundColor: 'tomato', paddingVertical: getXdp(2) }}
                                onPress={() => this.onCreateOrder(isLoading)}
                            >
                                <Text style={{ fontSize: getXdp(3), textAlign: 'center', color: 'white' }}>
                                    {`${isLoading ? 'Please wait...' : 'Create Order'}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
