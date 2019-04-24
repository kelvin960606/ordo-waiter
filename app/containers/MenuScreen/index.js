/**
 *
 * MenuScreen
 *
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import CartScreen from 'containers/CartScreen';
import PriceTag from 'components/PriceTag';
import { dataChecking, getXdp, getYdp } from 'app/globalUtils';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectMenuScreen from './selectors';
import reducer from './reducer';
import { getProductData } from './actions';
import saga from './saga';
import productData from './productData';

export class MenuScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {};

    componentWillMount = () => {
        this.setState({
            currentStatus: this.props.orderedProducts || {},
        });

        if (!globalScope.productData || !globalScope.productData.length) {
            this.props.dispatch(getProductData());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.orderedProducts !== this.state.orderedProducts) {
            this.setState({
                currentStatus: nextProps.orderedProducts || {},
            });
        }

        if (nextProps.getProductLoading !== this.props.getProductLoading) {
            this.setState({
                getProductLoading: nextProps.getProductLoading,
            });
        }
        console.log(nextProps);
    }

    onManageTopping = (toppingId) => {
        const { onDisplayProduct, onEditToppingProductIndex } = this.state;
        const newStatus = { ...this.state.currentStatus };
        const productItem = newStatus[onDisplayProduct.id].items[onEditToppingProductIndex];
        productItem.topping = productItem.topping || [];

        const idInNumber = Number(toppingId);

        if (productItem.topping.includes(idInNumber)) {
            productItem.topping.splice(productItem.topping.indexOf(idInNumber), 1);
        } else {
            productItem.topping.push(idInNumber);
        }

        this.setState({
            currentStatus: newStatus,
        });
    }

    onToggleProductDetail = (product) => {
        this.setState({
            showProductDetail: !this.state.showProductDetail,
            onDisplayProduct: product,
        });
    }

    onToggleTopping = (dataObj) => {
        this.setState({
            showManageTopping: !this.state.showManageTopping,
            onEditToppingProductIndex: dataObj && dataObj.index,
        });
    }

    onToggleCartMenu = () => {
        this.setState({
            showCart: !this.state.showCart,
        });
    }

    getProductDataFromAsyncStore = async () => AsyncStorage.getItem('productData');
    setProductDataFromAsyncStore = async (data) => AsyncStorage.setItem('productData', data);

    randomKitten = () => {
        const num = Math.floor((Math.random() * 100) + 200);
        return `http://placekitten.com/${num}/${num}`;
    }

    renderMenuItem = (dataObj) => (
        <TouchableOpacity
            onPress={() => this.onToggleProductDetail(dataObj.item)}
            style={{
                borderStyle: 'solid',
                borderWidth: 3,
                borderColor: this.state.currentStatus[dataObj.item.id] ? '#E89558' : 'transparent',
                width: getXdp(92 / globalScope.numColumnForSmallCard),
                margin: getXdp(1),
                position: 'relative',
            }}
        >
            <View style={{ borderColor: 'lightgray', borderWidth: 1 }}>
                {
                    dataChecking(this.state.currentStatus, dataObj.item.id, 'items', 'length') &&
                        <View
                            className="counter-balloon"
                            style={{
                                top: -getXdp(2.8),
                                right: -getXdp(2.8),
                                zIndex: 1,
                                borderRadius: 50,
                                paddingVertical: getXdp(1),
                                paddingHorizontal: getXdp(1.8),
                                position: 'absolute',
                                backgroundColor: '#E89558',
                                borderColor: 'lightgray',
                                borderWidth: getXdp(0.3),
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: getXdp(2.5) }}>
                                {this.state.currentStatus[dataObj.item.id].items.length}
                            </Text>
                        </View>
                }
                <View>
                    <Image style={{ height: getXdp((92 - 2) / globalScope.numColumnForSmallCard), width: getXdp((92 - 2) / globalScope.numColumnForSmallCard) }} source={{ uri: this.randomKitten() }} />
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: getXdp(2),
                    }}
                >
                    <Text style={{ fontSize: getXdp(2.3), fontWeight: 'bold', marginBottom: 5 }}>{dataObj.item.product_code}</Text>
                    <Text style={{ fontSize: getXdp(2), marginBottom: 10 }}>{dataObj.item.product_name}</Text>
                    <PriceTag value={dataObj.item.product_price} />
                </View>
            </View>
        </TouchableOpacity>
    );

    renderProductItem = (dataObj) => (
        <View
            className="product-detail-item"
            style={{
                width: getXdp(80),
                paddingVertical: getXdp(3.5),
                borderColor: 'salmon',
                borderWidth: 1,
                paddingLeft: 50,
                paddingRight: 20,
                marginBottom: 10,
            }}
        >
            <Text style={{ position: 'absolute', left: getXdp(2), top: getXdp(2.4), fontSize: getXdp(4) }}>{dataObj.index + 1}</Text>
            <View>
                {
                    dataObj.item.topping && dataObj.item.topping.map((toppingId, index2) => (
                        <Text key={index2}>{`- ${dataChecking(this.state.onDisplayProduct, 'toppings', toppingId, 'toppingText')}`}</Text>
                    ))
                }
                {
                    !dataChecking(dataObj, 'item', 'topping', 'length') &&
                        <Text style={{ color: 'lightgray', fontSize: getXdp(2), paddingLeft: getXdp(2) }}>No topping yet</Text>
                }
            </View>
            <TouchableOpacity
                onPress={() => {
                    this.onToggleTopping(dataObj);
                }}
                style={{
                    backgroundColor: 'tomato',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    position: 'absolute',
                    right: getXdp(1),
                    top: getXdp(1),
                    width: getXdp(10),
                    borderRadius: 15,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: getXdp(2),
                    }}
                >
                    Add Topping
                </Text>
            </TouchableOpacity>
        </View>
    );

    renderToppingItem = (dataObj) => {
        const { currentStatus, onDisplayProduct, onEditToppingProductIndex } = this.state;
        const topping = currentStatus[onDisplayProduct.id].items[onEditToppingProductIndex].topping || [];

        return (
            <TouchableOpacity
                onPress={() => {
                    this.onManageTopping(dataObj.item);
                }}
                style={{
                    borderStyle: 'solid',
                    borderWidth: 3,
                    borderColor: topping.includes(Number(dataObj.item)) ? '#E89558' : 'lightgray',
                    width: getXdp(60 / globalScope.numColumnForSmallCard),
                    margin: getXdp(1),
                    position: 'relative',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                }}
            >
                <Text style={{ textAlign: 'center' }}>
                    {dataChecking(onDisplayProduct, 'toppings', dataObj.item, 'toppingText')}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { onDisplayProduct } = this.state;

        return (
            <View style={{ height: getYdp(90), width: getXdp(100), position: 'relative', backgroundColor: 'white' }}>
                {
                    this.state.getProductLoading ?
                        <Text style={{ fontSize: getXdp(5), padding: getXdp(5) }}>Loading...</Text>
                        :
                        <View
                            style={{
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                position: 'absolute',
                                paddingVertical: getYdp(5),
                            }}
                        >
                            {
                                this.state.showProductDetail &&
                                    <View
                                        className="product-detail-modal-overlay"
                                        style={{
                                            backgroundColor: '#000',
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            zIndex: 2,
                                            opacity: 0.7,
                                        }}
                                    >
                                    </View>
                            }
                            {
                                this.state.showProductDetail &&
                                    <View
                                        className="product-detail-dialog"
                                        style={{
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            top: getXdp(10),
                                            bottom: getXdp(1),
                                            left: getXdp(5),
                                            right: getXdp(5),
                                            borderWidth: 3,
                                            borderColor: '#E89558',
                                            zIndex: 3,
                                            padding: 25,
                                            paddingTop: getYdp(3),
                                        }}
                                    >
                                        <TouchableOpacity
                                            className="view-cart-button"
                                            onPress={() => {
                                                this.onToggleProductDetail();
                                            }}
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
                                        <Text
                                            className="product-detail-title"
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: getXdp(3),
                                                paddingRight: 50,
                                                marginBottom: 5,
                                            }}
                                        >
                                            Chicken Leg Piece with salsa salad
                                        </Text>
                                        <Text
                                            className="product-detail-total"
                                            style={{
                                                color: 'gray',
                                                paddingRight: 50,
                                                marginBottom: 5,
                                                fontSize: getXdp(2),
                                            }}
                                        >
                                            Total: {dataChecking(this.state.currentStatus, onDisplayProduct.id, 'items', 'length') || 0}
                                        </Text>
                                        <View
                                            className="product-detail-item-group"
                                            style={{
                                                maxHeight: getYdp(65),
                                            }}
                                        >
                                            <FlatList
                                                numColumns={1}
                                                data={dataChecking(this.state.currentStatus, onDisplayProduct.id, 'items') || []}
                                                // nextPage={this.props.nextOrderPage}
                                                renderItem={this.renderProductItem}
                                                // onEndReached={() => { alert('on end reach'); }}
                                                // onEndReachedThreshold={0.3}
                                                // onViewableItemsChanged={this.props.onViewChanged}
                                                keyExtractor={(item, index) => `${index}`}
                                                ListFooterComponent={() => (
                                                    <TouchableOpacity
                                                        className="product-detail-item add-new-item"
                                                        onPress={() => {
                                                            const newStatus = { ...this.state.currentStatus };
                                                            newStatus[onDisplayProduct.id] = newStatus[onDisplayProduct.id] || {};
                                                            newStatus[onDisplayProduct.id].items = newStatus[onDisplayProduct.id].items || [];
                                                            newStatus[onDisplayProduct.id].items.push({});
                                                            this.setState({
                                                                currentStatus: newStatus,
                                                            });
                                                        }}
                                                        style={{
                                                            width: getXdp(80),
                                                            paddingVertical: getXdp(3.5),
                                                            borderColor: 'salmon',
                                                            borderWidth: 1,
                                                            marginBottom: 10,
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: getXdp(5), fontWeight: 'bold', textAlign: 'center' }}>+</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </View>
                            }
                            {
                                this.state.showManageTopping &&
                                    <View
                                        className="manage-topping-modal-overlay"
                                        style={{
                                            backgroundColor: '#000',
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            zIndex: 4,
                                            opacity: 0.5,
                                        }}
                                    >
                                    </View>
                            }
                            {
                                this.state.showManageTopping &&
                                    <View
                                        className="manage-topping-dialog"
                                        style={{
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            top: getXdp(25),
                                            bottom: getXdp(35),
                                            left: getXdp(15),
                                            right: getXdp(15),
                                            borderWidth: 3,
                                            borderColor: '#E89558',
                                            zIndex: 5,
                                            padding: 25,
                                            paddingTop: getYdp(3),
                                        }}
                                    >
                                        <TouchableOpacity
                                            className="view-cart-button"
                                            onPress={this.onToggleTopping}
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
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.onToggleTopping();
                                            }}
                                            style={{
                                                bottom: 10,
                                                right: 10,
                                                position: 'absolute',
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            <Text style={{ color: 'tomato', fontWeight: 'bold' }}>Done</Text>
                                        </TouchableOpacity>
                                        <Text
                                            className="manage-topping-title"
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: getXdp(3),
                                                paddingRight: 50,
                                                marginBottom: 5,
                                            }}
                                        >
                                            Topping Available
                                        </Text>
                                        <Text
                                            className="manage-topping-total"
                                            style={{
                                                color: 'gray',
                                                paddingRight: 50,
                                                marginBottom: 5,
                                                fontSize: getXdp(2),
                                            }}
                                        >
                                            Total: {dataChecking(this.state.onDisplayProduct, 'toppings') ? Object.keys(this.state.onDisplayProduct.toppings).length : 0}
                                        </Text>
                                        <View className="manage-topping-item-group" style={{ maxHeight: getYdp(55) }}>
                                            <FlatList
                                                numColumns={globalScope.numColumnForSmallCard}
                                                data={Object.keys(dataChecking(this.state.onDisplayProduct, 'toppings') || {})}
                                                // nextPage={this.props.nextOrderPage}
                                                renderItem={this.renderToppingItem}
                                                // onEndReached={() => { alert('on end reach'); }}
                                                // onEndReachedThreshold={0.3}
                                                // onViewableItemsChanged={this.props.onViewChanged}
                                                keyExtractor={(item, index) => index}
                                            />
                                        </View>
                                    </View>
                            }
                            {
                                globalScope.productData &&
                                    <FlatList
                                        style={{ paddingTop: getXdp(2), margin: getXdp(1) }}
                                        numColumns={globalScope.numColumnForSmallCard}
                                        data={globalScope.productData}
                                        // nextPage={this.props.nextOrderPage}
                                        renderItem={this.renderMenuItem}
                                        // onEndReached={() => { alert('on end reach'); }}
                                        // onEndReachedThreshold={0.3}
                                        // onViewableItemsChanged={this.props.onViewChanged}
                                        keyExtractor={(item, index) => index}
                                    />
                            }
                            <TouchableOpacity
                                className="view-cart-button"
                                onPress={this.props.onToggleMenu}
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
                            <TouchableOpacity
                                className="view-cart-button"
                                onPress={this.onToggleCartMenu}
                                style={{
                                    position: 'absolute',
                                    bottom: getXdp(2),
                                    right: getXdp(2),
                                    zIndex: 1,
                                    padding: getXdp(1),
                                }}
                            >
                                <Image source={require('../../assets/images/checkout.png')} />
                            </TouchableOpacity>

                            <CartScreen
                                visible={this.state.showCart}
                                toggle={this.onToggleCartMenu}
                            />
                        </View>
                }
            </View>
        );
    }
}

MenuScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    menuscreen: makeSelectMenuScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'menuScreen', reducer });
const withSaga = injectSaga({ key: 'menuScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(MenuScreen);
