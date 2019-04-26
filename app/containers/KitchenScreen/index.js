/**
 *
 * KitchenScreen
 *
 */

import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import firebase from 'react-native-firebase';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKitchenScreen from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getProductData } from '../MenuScreen/actions';
import { getXdp, dataChecking } from '../../globalUtils';

export class KitchenScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    static navigationOptions = {
        title: 'Kitchen Display',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };


    state = {
        screen: 'order',
        tables: [],
    };

    componentWillMount() {
        if (!globalScope.productData || !globalScope.productData.length) {
            this.props.dispatch(getProductData());
        }
    }

    componentDidMount() {
        this.ref = firebase.firestore().collection('merchants').doc('1').collection('stores').doc('1');
        this.unsubscribe = this.ref.onSnapshot(this.subscribeTables);
    }

    subscribeTables = (documentSnapshot) => {
        if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            const { tables } = data;
            const tb = [];
            Object.keys(tables).forEach((key) => {
                tb.push({
                    key,
                    data: tables[key],
                });
            });
            this.setState({ tables: tb });
        } else {
            console.log('document not found');
        }
    }

    renderScreen = () => {
        switch (this.state.screen) {
            case 'order':
                return this.renderOrder();
            case 'history':
                return this.renderHistory();
            default:
                break;
        }
        return null;
    }

    renderOrder = () => {
        return (
            <View>
                <FlatList
                    numColumns={5}
                    data={this.state.tables}
                    // nextPage={this.props.nextOrderPage}
                    renderItem={(i) => {
                        const data = dataChecking(i, 'item', 'data');
                        const status = dataChecking(data, 'status', 'dining');
                        const orders = dataChecking(data, 'orders');
                        if (status) {
                            return (
                                <View style={{ width: getXdp(90) / 5, margin: 10 }}>
                                    <View style={{ backgroundColor: 'skyblue', paddingVertical: 10 }}>
                                        <Text>{`Table No: ${i.item.key}`}</Text>
                                    </View>
                                    <View style={{ backgroundColor: 'white' }}>
                                        {
                                            orders && orders.map((order) => {
                                                return (
                                                    <View style={{ paddingLeft: 5 }}>
                                                        <Text>{order.count} - <Text>{order.product_name}</Text></Text>
                                                        <View style={{ paddingLeft: 10 }}>
                                                            {
                                                                order.toppings && order.toppings.map((top) => (
                                                                    <Text>{top.topping_name}</Text>
                                                                ))
                                                            }
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        }
                                    </View>
                                </View>
                            );
                        }
                        return null;
                    }}
                    // onEndReached={() => { alert('on end reach'); }}
                    // onEndReachedThreshold={0.3}
                    // onViewableItemsChanged={this.props.onViewChanged}
                    keyExtractor={(item, index) => `${index}`}
                />
            </View>
        );
    }

    renderHistory = () => {
        return (
            <View>
                <Text>History</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'gray' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.setState({ screen: 'order' })} style={{ backgroundColor: this.state.screen === 'order' ? 'tomato' : 'transparent', padding: 10 }}>
                            <Text style={{ padding: 10, color: 'white' }}>Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ screen: 'history' })} style={{ backgroundColor: this.state.screen === 'history' ? 'tomato' : 'transparent', padding: 10 }}>
                            <Text style={{ padding: 10, color: 'white' }}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    {this.renderScreen()}
                </View>
            </View>
        );
    }
}

KitchenScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    kitchenscreen: makeSelectKitchenScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'kitchenScreen', reducer });
const withSaga = injectSaga({ key: 'kitchenScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(KitchenScreen);
