/**
 *
 * MyAppScreen
 *
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import firebase from 'react-native-firebase';
import PriceTag from 'components/PriceTag';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { getXdp, dataChecking } from 'app/globalUtils';
import makeSelectMyAppScreen from './selectors';
import reducer from './reducer';
import saga from './saga';
import tableData from './table.js';

export class MyAppScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('merchants').doc('1').collection('branches').doc('1');
        this.unsubscribe = null;
        this.state = {
            tables: tableData,
        };
        console.log('tabledata from json:', this.state.tables);
    }

    componentDidMount() {
        // try {
        //     // should change to normal signIn
        //     firebase.auth().signInAnonymously()
        //         .then((user) => {
        //             console.log(JSON.stringify(user));
        //         });
        // } catch (error) {
        //     alert(JSON.stringify(error));
        // }
        // this.unsubscribe = this.ref.onSnapshot(this.subscribeTables);
    }

    componentWillUnmount() {
        // this.unsubscribe();
    }

    subscribeTables = (documentSnapshot) => {
        if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            console.log(data);
            const { tables } = data;
            // console.log('dining', dining);
            console.log('tables', tables);
            // console.log('takeaways', takeaways);
            const tb = [];
            Object.keys(tables).forEach((key) => {
                console.log(key, tables[key]);
                tb.push({
                    key,
                    data: tables[key],
                });
            });
            console.log('table', tb);
            this.setState({ tables: tb });
        } else {
            console.log('document not found');
        }
    }

    renderTableCard = (item) => {
        if (!dataChecking(item, 'item', 'data', 'status', 'dining')) {
            return (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Menu', {
                        item,
                        tableData: {
                            test: 123,
                            halo: 456,
                        },
                    })}
                >
                    <View
                        style={{
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            borderColor: 'gray',
                            height: getXdp(45),
                            width: getXdp(45),
                            margin: getXdp(2),
                            padding: getXdp(2),
                        }}
                    >
                        <Text
                            className="empty-text-display"
                            style={{
                                color: 'gray',
                                fontSize: 16,
                                fontWeight: 'bold',
                                top: getXdp(19),
                                textAlign: 'center',
                            }}
                        >
                            EMPTY
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Menu', {
                    orderedProducts: dataChecking(item, 'item', 'data', 'products'),
                    tableData: {
                        test: 123,
                        halo: 456,
                    },
                })}
            >
                <View
                    style={{
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: getXdp(46),
                        width: getXdp(46),
                        margin: getXdp(2),
                        padding: getXdp(2),
                        backgroundColor: 'white',
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <Text
                            className="table-code"
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 25,
                                fontWeight: 'bold',
                                padding: getXdp(2),
                                backgroundColor: dataChecking(item, 'item', 'data', 'status', 'dining') ? 'red' : 'red',
                            }}
                        >
                            {dataChecking(item, 'item', 'key')}
                        </Text>
                        <Text
                            style={{ fontSize: 7 }}
                        >
                            Order Created
                        </Text>
                    </View>
                    <View className="top-left">
                        <Text>logo</Text>
                        <Text>{dataChecking(item, 'item', 'data', 'info', 'pax')}pax</Text>
                    </View>
                    <View
                        className="bottom-left"
                        style={{
                            position: 'absolute',
                            bottom: getXdp(2),
                            left: getXdp(2),
                        }}
                    >
                        {
                            dataChecking(item, 'item', 'data', 'payment', 'total') &&
                                <PriceTag value={item.item.data.payment.total} />
                        }
                    </View>
                    <View
                        className="bottom-right"
                        style={{
                            position: 'absolute',
                            bottom: getXdp(2),
                            right: getXdp(2),
                        }}
                    >
                        <Text>xx mins ago</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={{ margin: getXdp(1), backgroundColor: '#EEE' }}>
                <FlatList
                    numColumns={2}
                    data={this.state.tables}
                    // nextPage={this.props.nextOrderPage}
                    renderItem={this.renderTableCard}
                    // onEndReached={() => { alert('on end reach'); }}
                    // onEndReachedThreshold={0.3}
                    // onViewableItemsChanged={this.props.onViewChanged}
                    keyExtractor={(item, index) => index}
                />
                <TouchableOpacity style={{ margin: 30, padding: 15, backgroundColor: 'tomato' }} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

MyAppScreen.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    myappscreen: makeSelectMyAppScreen(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'myAppScreen', reducer });
const withSaga = injectSaga({ key: 'myAppScreen', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(MyAppScreen);
