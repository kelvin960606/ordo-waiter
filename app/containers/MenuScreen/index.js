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
            currentStatus: this.props.navigation.getParam('orderedProducts', {}),
        });

        if (!globalScope.productData || !globalScope.productData.length) {
            this.props.dispatch(getProductData());
        }
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
                width: getXdp(46),
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
                                top: -12,
                                right: -12,
                                zIndex: 1,
                                borderRadius: 50,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                position: 'absolute',
                                backgroundColor: '#E89558',
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {this.state.currentStatus[dataObj.item.id].items.length}
                            </Text>
                        </View>
                }
                <View>
                    <Image style={{ height: getXdp(44.5), width: getXdp(44.5) }} source={{ uri: this.randomKitten() }} />
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: getXdp(2),
                    }}
                >
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{dataObj.item.product_code}</Text>
                    <Text style={{ marginBottom: 10 }}>{dataObj.item.product_name}</Text>
                    <PriceTag value={dataObj.item.product_price} />
                </View>
            </View>
        </TouchableOpacity>
    );

    renderProductItem = (dataObj) => (
        <View
            className="product-detail-item"
            style={{
                width: getXdp(73.5),
                borderColor: 'salmon',
                borderWidth: 1,
                paddingVertical: 20,
                paddingLeft: 50,
                paddingRight: 20,
                marginBottom: 10,
            }}
        >
            <Text style={{ position: 'absolute', left: 10, top: 15, fontSize: 20 }}>{dataObj.index + 1}</Text>
            <View>
                {
                    dataObj.item.topping && dataObj.item.topping.map((toppingId, index2) => (
                        <Text key={index2}>{`- ${dataChecking(this.state.onDisplayProduct, 'toppings', toppingId, 'toppingText')}`}</Text>
                    ))
                }
                {
                    !dataChecking(dataObj, 'item', 'topping', 'length') &&
                        <Text style={{ color: 'lightgray' }}>No topping yet</Text>
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
                    right: 5,
                    top: 5,
                    width: 70,
                    borderRadius: 15,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 10,
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
                    width: getXdp(30),
                    margin: getXdp(1),
                    position: 'relative',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                }}
            >
                <Text style={{ textAlign: 'center' }}>
                    {console.log(onDisplayProduct) || dataChecking(onDisplayProduct, 'toppings', dataObj.item, 'toppingText')}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const { onDisplayProduct } = this.state;
        return (
            <View style={{ height: getYdp(80), position: 'relative' }}>
                <Text style={{ paddingHorizontal: 10, paddingTop: 10, color: 'lightgray' }}>Total: 25 items</Text>
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
                                zIndex: 1,
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
                                top: getXdp(15),
                                bottom: getXdp(15),
                                left: getXdp(10),
                                right: getXdp(10),
                                borderWidth: 3,
                                borderColor: '#E89558',
                                zIndex: 2,
                                padding: 10,
                            }}
                        >
                            {/* <TouchableOpacity
                                onPress={() => {
                                    // alert('canceling change');
                                    this.onToggleProductDetail();
                                }}
                                style={{
                                    top: 10,
                                    right: 10,
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    zIndex: 2000,
                                }}
                            >
                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Cancel</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={() => {
                                    // alert('adding to order');
                                    this.onToggleProductDetail();
                                }}
                                style={{
                                    bottom: 10,
                                    right: 10,
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                }}
                            >
                                <Text style={{ color: 'tomato', fontWeight: 'bold' }}>Save</Text>
                            </TouchableOpacity>
                            <Text
                                className="product-detail-title"
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
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
                                }}
                            >
                                Total: {dataChecking(this.state.currentStatus, onDisplayProduct.id, 'items', 'length') || 0}
                            </Text>
                            <View
                                className="product-detail-item-group"
                                style={{
                                    maxHeight: getYdp(52),
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
                                                width: getXdp(73.5),
                                                borderColor: 'salmon',
                                                borderWidth: 1,
                                                paddingVertical: 15,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>+</Text>
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
                                zIndex: 3,
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
                                zIndex: 4,
                                padding: 10,
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.onToggleTopping}
                                style={{
                                    top: 10,
                                    right: 10,
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    zIndex: 2000,
                                }}
                            >
                                <Text style={{ color: 'gray', fontWeight: 'bold' }}>Cancel</Text>
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
                                    fontSize: 20,
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
                                }}
                            >
                                Total: {dataChecking(this.state.onDisplayProduct, 'toppings') ? Object.keys(this.state.onDisplayProduct.toppings).length : 0}
                            </Text>
                            <View className="manage-topping-item-group" style={{ maxHeight: getYdp(40) }}>
                                <FlatList
                                    numColumns={2}
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
                            style={{ paddingTop: 10, margin: getXdp(1) }}
                            numColumns={2}
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
                    onPress={this.onToggleCartMenu}
                    style={{
                        borderRadius: 50,
                        backgroundColor: 'salmon',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        paddingVertical: 15,
                    }}
                >
                    <Text>Cart Logo</Text>
                </TouchableOpacity>
                <View
                    style={{
                        posotion: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: 'white',
                    }}
                >
                    {
                        this.state.showCart &&
                            <View>
                                <View
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
                                        zIndex: 2000,
                                    }}
                                >
                                    <CartScreen
                                        onToggleCartMenu={this.onToggleCartMenu}
                                    />
                                </View>
                            </View>
                    }
                </View>
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
