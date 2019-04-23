/**
 *
 * MenuScreen
 *
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
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
import { getProductInfo } from './actions';
import saga from './saga';
import productData from './productData';

export class MenuScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {};

    componentWillMount = () => {
        this.setState({
            currentStatus: this.props.navigation.getParam('orderedProducts', {}),
        });
        // this.setState({
        //     currentTableData: this.props.tableData,
        // });
        globalScope.productData = productData; // this line to be remove when dispatch working
    }

    componentDidMount() {
        if (!globalScope.productData || !globalScope.productData.length) {
            // this.props.dispatch(getProductInfo());
            globalScope.productData = productData;
        }
    }

    componentWillReceiveProps(nextProps) {
        const { menuscreen } = nextProps;
        if (menuscreen.productData && menuscreen.productData !== this.props.menuscreen.productData) {
            // this.setState({
            //     productData: menuscreen.productData,
            // });
            globalScope.productData = menuscreen.productData;
            console.log(JSON.stringify(globalScope.productData));
        }
        console.log(nextProps);
    }

    onAddTopping = () => {
        alert('onAddTopping');
    }

    onToggleProductDetail = (details) => {
        this.setState({
            showProductDetail: !this.state.showProductDetail,
            onDisplayDetail: details || null,
        });
    }

    onToggleTopping = () => {
        this.setState({
            showManageTopping: !this.state.showManageTopping,
        });
    }

    onToggleCartMenu = () => {
        this.setState({
            showCart: !this.state.showCart,
        });
        console.log(this.props.navigation.getParam('tableData', 'no data'));
    }

    randomKitten = () => {
        const num = Math.floor((Math.random() * 100) + 200);
        return `http://placekitten.com/${num}/${num}`;
    }

    renderMenuItem = (item) => (
        <TouchableOpacity
            // className={`${this.state.currentTableData[item.id || 1] ? 'active' : ''}`}
            onPress={() => this.onToggleProductDetail(this.state.currentStatus[item.item.id])}
            style={{
                borderStyle: 'solid',
                borderWidth: 3,
                borderColor: this.state.currentStatus[item.item.id] ? '#E89558' : 'transparent',
                width: getXdp(46),
                margin: getXdp(2),
                position: 'relative',
            }}
        >
            <View style={{ borderColor: 'lightgray', borderWidth: 1 }}>
                {
                    dataChecking(this.state.currentStatus, item.item.id, 'count') &&
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
                                {this.state.currentStatus[item.item.id].count}
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
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.item.product_code}</Text>
                    <Text style={{ marginBottom: 10 }}>{item.item.product_name}</Text>
                    <PriceTag value={item.item.product_price} />
                </View>
            </View>
        </TouchableOpacity>
    );

    renderToppingItem = (item) => (
        <View
            onPress={() => {
                this.onAddTopping(item);
            }}
            style={{
                borderStyle: 'solid',
                borderWidth: 3,
                borderColor: true ? '#E89558' : 'lightgray',
                width: getXdp(46),
                margin: getXdp(2),
                position: 'relative',
            }}
        >
            <Text>topping item</Text>
        </View>
    );

    render() {
        const { tempDetail, onDisplayDetail } = this.state;
        const toBeDisplay = tempDetail || onDisplayDetail;
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
                            <TouchableOpacity
                                onPress={() => {
                                    alert('canceling change');
                                    this.setState({
                                        tempDetail: null,
                                    });
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
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    alert('adding to order');
                                    this.setState({
                                        tempDetail: null,
                                    });
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
                                <Text style={{ color: 'tomato', fontWeight: 'bold' }}>Done</Text>
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
                                Total: {dataChecking(toBeDisplay, 'items', 'length') || 0}
                            </Text>
                            <View
                                className="product-detail-item-group"
                            >
                                {
                                    dataChecking(toBeDisplay, 'items') && toBeDisplay.items.map((item, index) => (
                                        <View key={index}>
                                            <View
                                                key={index}
                                                className="product-detail-item"
                                                style={{
                                                    width: getXdp(74),
                                                    borderColor: 'salmon',
                                                    borderWidth: 1,
                                                    paddingVertical: 20,
                                                    paddingLeft: 50,
                                                    paddingRight: 20,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                <Text style={{ position: 'absolute', left: 10, top: 15, fontSize: 20 }}>{index + 1}</Text>
                                                <View>
                                                    {
                                                        item.topping && item.topping.map((topping, index2) => (
                                                            <Text key={index2}>{`- ${topping.toppingId}`}</Text>
                                                        ))
                                                    }
                                                    {
                                                        !dataChecking(item, 'topping', 'length') &&
                                                            <Text style={{ color: 'lightgray' }}>No topping yet</Text>
                                                    }
                                                </View>
                                                <TouchableOpacity
                                                    onPress={this.onToggleTopping}
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
                                        </View>
                                    ))
                                }
                                <TouchableOpacity
                                    className="product-detail-item add-new-item"
                                    onPress={() => {
                                        const newTempDetail = { ...toBeDisplay };
                                        newTempDetail.items = newTempDetail.items || [];
                                        newTempDetail.items.push({});
                                        this.setState({
                                            tempDetail: newTempDetail,
                                        });
                                    }}
                                    style={{
                                        width: getXdp(74),
                                        borderColor: 'salmon',
                                        borderWidth: 1,
                                        paddingVertical: 15,
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>+</Text>
                                </TouchableOpacity>
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
                                    alert('adding topping');
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
                                Total: {[{}, {}].length}
                            </Text>
                            <View className="manage-topping-item-group">
                                <FlatList
                                    numColumns={2}
                                    data={[{}, {}, {}, {}]}
                                    // nextPage={this.props.nextOrderPage}
                                    renderItem={this.renderToppingItem}
                                    // onEndReached={() => { alert('on end reach'); }}
                                    // onEndReachedThreshold={0.3}
                                    // onViewableItemsChanged={this.props.onViewChanged}
                                    // keyExtractor={(item, index) => index}
                                />
                            </View>
                        </View>
                }
                {
                    globalScope.productData &&
                        <FlatList
                            style={{ paddingTop: 10 }}
                            numColumns={2}
                            data={globalScope.productData}
                            // nextPage={this.props.nextOrderPage}
                            renderItem={this.renderMenuItem}
                            // onEndReached={() => { alert('on end reach'); }}
                            // onEndReachedThreshold={0.3}
                            // onViewableItemsChanged={this.props.onViewChanged}
                            // keyExtractor={(item, index) => index}
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
                            <CartScreen
                                onToggleCartMenu={this.onToggleCartMenu}
                            />
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
