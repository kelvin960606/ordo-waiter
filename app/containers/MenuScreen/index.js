/**
 *
 * MenuScreen
 *
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import CartScreen from 'containers/CartScreen';
import { getXdp, getYdp } from 'app/globalUtils';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectMenuScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class MenuScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    state = {};

    componentWillMount = () => {
        console.log(this.props.navigation.getParam('tableData', 'no data'));
        // this.setState({
        //     currentTableData: this.props.tableData,
        // });
    }

    onPressMenuCard = (item) => {
        this.setState({
            showProductDetail: !this.state.showProductDetail,
        });
    }

    onToggleProductDetail = () => {
        this.setState({
            showProductDetail: !this.state.showProductDetail,
        });
        console.log(this.props.navigation.getParam('tableData', 'no data'));
    }

    onToggleCartMenu = () => {
        this.setState({
            showCart: !this.state.showCart,
        });
        console.log(this.props.navigation.getParam('tableData', 'no data'));
    }

    renderMenuCard = (item) => (
        <TouchableOpacity
            // className={`${this.state.currentTableData[item.id || 1] ? 'active' : ''}`}
            onPress={() => this.onPressMenuCard(item)}
            style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'lightgray',
                // borderColor: this.state.currentTableData[item.id] ? 'salmon' : 'gray',
                height: getXdp(46),
                width: getXdp(46),
                margin: getXdp(2),
                padding: getXdp(2),
            }}
        >
            <View>
                <Text>Image</Text>
            </View>
            <View
                style={{
                    backgroundColor: 'white',
                }}
            >
                <Text>Menu item code</Text>
                <Text>Menu item name</Text>
                <Text>Menu item price</Text>
            </View>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={{ height: getYdp(80), position: 'relative', backgroundColor: 'blue' }}>
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
                                backgroundColor: '#F5F5F5',
                                position: 'absolute',
                                margin: getXdp(10),
                                bottom: getXdp(10),
                                left: getXdp(10),
                                right: getXdp(10),
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.onToggleProductDetail}
                                style={{
                                    backgroundColor: 'tomato',
                                    top: 10,
                                    right: 10,
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                }}
                            >
                                <Text>X</Text>
                            </TouchableOpacity>
                            <Text>product detail</Text>
                        </View>
                }
                {
                    this.state.showProductDetail &&
                        <View
                            className="product-detail-dialog"
                            style={{
                                backgroundColor: '#F5F5F5',
                                position: 'absolute',
                                top: getXdp(10),
                                bottom: getXdp(10),
                                left: getXdp(10),
                                right: getXdp(10),
                                zIndex: 2,
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.onToggleProductDetail}
                                style={{
                                    backgroundColor: 'tomato',
                                    top: 10,
                                    right: 10,
                                    position: 'absolute',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                }}
                            >
                                <Text>X</Text>
                            </TouchableOpacity>
                            <Text>product detail</Text>
                        </View>
                }
                <Text>asdasdadsad</Text>
                {
                    // this.state.currentTableData &&
                    [{}, {}, {}, {}, {}].map((item, index) => (
                        <View key={index}>
                            {this.renderMenuCard(item, index)}
                        </View>
                    ))
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
