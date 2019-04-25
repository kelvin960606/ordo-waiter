/**
 *
 * MenuScreen
 *
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, AsyncStorage, ScrollView } from 'react-native';
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

const numColSmallCard = globalScope.numColumnForSmallCard;
// const marginSmallCard = globalScope.marginForSmallCard;
// const paddingSmallCard = globalScope.paddingForSmallCard;

export class MenuScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {};

    componentWillMount = () => {
        this.setState({
            currentCart: dataChecking(this.props.currentTableData, 'data', 'products') || {},
        });

        if (!globalScope.productData || !globalScope.productData.length) {
            this.props.dispatch(getProductData());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentTableData !== this.props.currentTableData) {
            this.setState({
                currentCart: nextProps.currentTableData || {},
            });
        }

        if (nextProps.menuscreen.getProductLoading !== this.props.menuscreen.getProductLoading) {
            this.setState({
                getProductLoading: nextProps.menuscreen.getProductLoading,
            });
        }

        if (nextProps.menuscreen.getProductSuccess === false) {
            alert(nextProps.menuscreen.getProductReturnMessage);
        }
    }

    onToggleProductDetail = (product) => {
        this.setState({
            showProductDetail: !this.state.showProductDetail,
            onDisplayProduct: product,
        });
    }

    onToggleCartMenu = () => {
        if (!this.state.showCart && (!this.state.currentCart || !Object.keys(this.state.currentCart).length)) {
            alert('Please choose menu first.');
            return null;
        }
        this.setState({
            showCart: !this.state.showCart,
        });
        return true;
    }

    getProductDataFromAsyncStore = async () => AsyncStorage.getItem('productData');
    setProductDataFromAsyncStore = async (data) => AsyncStorage.setItem('productData', data);

    randomKitten = () => {
        const num = Math.floor((Math.random() * 100) + 200);
        return `http://placekitten.com/${num}/${num}`;
    }

    renderMenuItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => this.onToggleProductDetail(item)}
            style={{
                borderStyle: 'solid',
                borderWidth: 3,
                borderColor: this.state.currentCart[item.id] ? '#E89558' : 'transparent',
                width: getXdp(90 / numColSmallCard),
                margin: getXdp(1),
                position: 'relative',
            }}
        >
            <View style={{ borderColor: 'lightgray', borderWidth: 1 }}>
                {
                    dataChecking(this.state.currentCart, item.id, 'items', 'length') &&
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
                                {this.state.currentCart[item.id].count}
                            </Text>
                        </View>
                }
                <View>
                    <Image style={{ height: getXdp((90 - 2) / numColSmallCard), width: getXdp((90 - 2) / numColSmallCard) }} source={{ uri: this.randomKitten() }} />
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: getXdp(2),
                    }}
                >
                    <Text style={{ fontSize: getXdp(2.3), fontWeight: 'bold', marginBottom: 5 }}>{item.product_code}</Text>
                    <Text style={{ fontSize: getXdp(2), marginBottom: 10 }}>{item.product_name}</Text>
                    <PriceTag value={item.product_price} />
                </View>
            </View>
        </TouchableOpacity>
    );

    renderProductItem = ({ index }) => {
        const { onDisplayProduct } = this.state;

        return (
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
                    flexDirection: 'row',
                }}
            >
                <Text style={{ alignSelf: 'center', fontSize: getXdp(4) }}>{index + 1}</Text>
                <ScrollView style={{ paddingHorizontal: getXdp(5) }} horizontal={true}>
                    {
                        dataChecking(onDisplayProduct, 'toppings', 'length') ?
                            onDisplayProduct.toppings.map((item2, index2) => (
                                <View key={`${index2}`}>{this.renderToppingItem({ item: item2, index: index2 }, index)}</View>
                            ))
                            :
                            <Text style={{ color: 'lightgray', fontSize: getXdp(2), paddingLeft: getXdp(2) }}>No topping available</Text>
                    }
                </ScrollView>
            </View>
        );
    };

    renderToppingItem = ({ item }, productItemIndex) => {
        const { currentCart, onDisplayProduct, onEditToppingProductIndex } = this.state;
        const targetProductItemIndex = productItemIndex !== undefined ? productItemIndex : onEditToppingProductIndex;
        const productItem = currentCart[onDisplayProduct.id].items[targetProductItemIndex] || {};
        const toppings = productItem.toppings || [];

        return (
            <TouchableOpacity
                onPress={() => {
                    productItem.toppings = productItem.toppings || [];

                    if (productItem.toppings.includes(item.id)) {
                        productItem.toppings.splice(productItem.toppings.indexOf(item.id), 1);
                    } else {
                        productItem.toppings.push(item.id);
                    }

                    const newCart = { ...this.state.currentCart };
                    newCart[onDisplayProduct.id].items[onEditToppingProductIndex] = productItem;

                    this.setState({
                        currentCart: newCart,
                    });
                }}
                style={{
                    borderRadius: 15,
                    borderStyle: 'solid',
                    borderWidth: 3,
                    borderColor: toppings.includes(item.id) ? 'tomato' : '#DDD',
                    paddingVertical: getXdp(1),
                    paddingHorizontal: getXdp(3),
                    marginHorizontal: getXdp(1),
                }}
            >
                <Text style={{ paddingRight: 20, fontSize: getXdp(1.8), color: true ? 'black' : 'gray' }}>
                    {dataChecking(item, 'topping_name')}
                </Text>
                {
                    dataChecking(item, 'topping_price') &&
                        <Text style={{ color: toppings.includes(item.id) ? 'tomato' : 'lightgray' }}><PriceTag value={item.topping_price} /></Text>
                }
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
                                            className="close-product-detail-button"
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
                                            Total: {dataChecking(this.state.currentCart, onDisplayProduct.id, 'items', 'length') || 0}
                                        </Text>
                                        <View
                                            className="product-detail-item-group"
                                            style={{
                                                maxHeight: getYdp(65),
                                            }}
                                        >
                                            <FlatList
                                                numColumns={1}
                                                data={dataChecking(this.state.currentCart, onDisplayProduct.id, 'items') || []}
                                                renderItem={this.renderProductItem}
                                                keyExtractor={(item, index) => `${index}`}
                                                ListFooterComponent={() => (
                                                    <TouchableOpacity
                                                        className="product-detail-item add-new-item"
                                                        onPress={() => {
                                                            const newCart = { ...this.state.currentCart };
                                                            newCart[onDisplayProduct.id] = newCart[onDisplayProduct.id] || { count: 0, items: [] };
                                                            newCart[onDisplayProduct.id].items.push({});
                                                            newCart[onDisplayProduct.id].count += 1;
                                                            this.setState({
                                                                currentCart: newCart,
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
                                globalScope.productData &&
                                    <FlatList
                                        style={{ paddingTop: getXdp(2), paddingHorizontal: getXdp(1), margin: getXdp(1) }}
                                        numColumns={numColSmallCard}
                                        data={globalScope.productData}
                                        // nextPage={this.props.nextOrderPage}
                                        renderItem={this.renderMenuItem}
                                        // onEndReached={() => { alert('on end reach'); }}
                                        // onEndReachedThreshold={0.3}
                                        // onViewableItemsChanged={this.props.onViewChanged}
                                        keyExtractor={(item, index) => `${index}`}
                                        ListFooterComponent={<View style={{ height: getYdp(5) }} />}
                                    />
                            }
                            <TouchableOpacity
                                className="close-menu-button"
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
                                <Image
                                    style={{ width: getXdp(10), height: getXdp(10) }}
                                    source={
                                        this.state.currentCart && Object.keys(this.state.currentCart).length ?
                                            require('../../assets/images/checkout.png')
                                            :
                                            require('../../assets/images/checkout-disable.png')
                                    }
                                />
                            </TouchableOpacity>

                            <CartScreen
                                currentTableData={this.props.currentTableData}
                                currentCartData={this.state.currentCart}
                                visible={this.state.showCart}
                                toggle={this.onToggleCartMenu}
                                onCancelOrder={this.props.onToggleMenu}
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
