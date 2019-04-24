/**
 *
 * MyAppScreen
 *
 */

import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import firebase from 'react-native-firebase';
import ModalWrapper from 'react-native-modal-wrapper';
import PriceTag from 'components/PriceTag';
import MenuScreen from 'containers/MenuScreen';
import { globalScope } from 'app/globalScope';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { getXdp, getYdp, dataChecking } from 'app/globalUtils';
import makeSelectMyAppScreen from './selectors';
import reducer from './reducer';
import saga from './saga';
import tableData from './table.js';

export class MyAppScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity
                className="logout-button"
                style={{ width: 40 }}
                onPress={async () => {
                    globalScope.token = null;
                    await AsyncStorage.removeItem('ordo_token');
                    globalScope.productData = null;
                    await AsyncStorage.removeItem('productData');
                    navigation.navigate('AuthLoading');
                }}
            >
                <Image
                    resizeMode="contain"
                    style={{ marginRight: 10, padding: 10, height: 30, width: 30, tintColor: 'tomato' }}
                    source={{ uri: 'https://img.icons8.com/material/48/000000/logout-rounded.png' }}
                />
            </TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('merchants').doc('1').collection('branches').doc('1');
        this.unsubscribe = null;
        this.state = {
            // tables: tableData,
        };
    }

    componentDidMount() {
        try {
            // should change to normal signIn
            firebase.auth().signInAnonymously()
                .then((user) => {
                    console.log(JSON.stringify(user));
                });
        } catch (error) {
            alert(JSON.stringify(error));
        }
        this.unsubscribe = this.ref.onSnapshot(this.subscribeTables);
    }

    componentWillUnmount() {
        this.unsubscribe();
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
            console.log('this.state.tables', tb);
        } else {
            console.log('document not found');
        }
    }

    renderTableCard = (item) => {
        const status = dataChecking(item, 'item', 'data', 'status', 'dining');
        // return (
        //     <TouchableOpacity
        //         onPress={() => {
        //             this.setState({
        //                 showMenuScreen: true,
        //                 targetTabldIndex: item.index,
        //             });
        //         }}
        //     >
        //         <View
        //             style={{
        //                 borderStyle: 'dashed',
        //                 borderWidth: 1,
        //                 borderColor: 'gray',
        //                 height: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / globalScope.numColumnForSmallCard),
        //                 width: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / globalScope.numColumnForSmallCard),
        //                 margin: getXdp(globalScope.marginForSmallCard),
        //                 padding: getXdp(globalScope.paddingForSmallCard),
        //             }}
        //         >
        //             <View
        //                 style={{
        //                     position: 'absolute',
        //                     right: 0,
        //                     top: 0,
        //                 }}
        //             >
        //                 <Text
        //                     className="table-code"
        //                     style={{
        //                         color: 'white',
        //                         textAlign: 'center',
        //                         fontSize: getXdp(3),
        //                         fontWeight: 'bold',
        //                         padding: getXdp(1.8),
        //                         backgroundColor: dataChecking(item, 'item', 'data', 'status', 'dining') ? 'red' : 'gray',
        //                     }}
        //                 >
        //                     {dataChecking(item, 'item', 'key')}
        //                 </Text>
        //                 <Text
        //                     style={{ fontSize: getXdp(1) }}
        //                 >
        //                     Order Created
        //                 </Text>
        //             </View>
        //             <Text
        //                 className="empty-text-display"
        //                 style={{
        //                     color: 'gray',
        //                     fontSize: getXdp(2.5),
        //                     fontWeight: 'bold',
        //                     top: getXdp(7),
        //                     textAlign: 'center',
        //                 }}
        //             >
        //                 EMPTY
        //             </Text>
        //         </View>
        //     </TouchableOpacity>
        // );

        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        showMenuScreen: true,
                        targetTabldIndex: item.index,
                    });
                }}
            >
                <View
                    style={{
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / globalScope.numColumnForSmallCard),
                        width: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / globalScope.numColumnForSmallCard),
                        margin: getXdp(globalScope.marginForSmallCard),
                        padding: getXdp(globalScope.paddingForSmallCard),
                        backgroundColor: status ? 'white' : '',
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
                                fontSize: getXdp(3),
                                fontWeight: 'bold',
                                padding: getXdp(1.8),
                                backgroundColor: status ? 'tomato' : 'gray',
                            }}
                        >
                            {dataChecking(item, 'item', 'key')}
                        </Text>
                        {/* <Text
                            style={{ fontSize: getXdp(1) }}
                        >
                            Order Created
                        </Text> */}
                    </View>
                    {
                        status &&
                            <View className="top-left">
                                <Image source={require('../../assets/images/people.png')} style={{ tintColor: 'gray', width: getXdp(4), height: getXdp(4) }} />
                                <Text style={{ fontSize: getXdp(2) }}>{dataChecking(item, 'item', 'data', 'info', 'pax')}pax</Text>
                            </View>
                    }
                    {
                        status &&
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
                    }
                    {
                        status &&
                            <View
                                className="bottom-right"
                                style={{
                                    position: 'absolute',
                                    bottom: getXdp(2),
                                    right: getXdp(2),
                                }}
                            >
                                <Text style={{ fontSize: getXdp(1.8) }}>10 mins ago</Text>
                            </View>
                    }
                    {
                        !status &&
                            <Text
                                className="empty-text-display"
                                style={{
                                    color: 'gray',
                                    fontSize: getXdp(2.5),
                                    fontWeight: 'bold',
                                    top: getXdp(7),
                                    textAlign: 'center',
                                }}
                            >
                                EMPTY
                            </Text>
                    }
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={{ padding: getXdp(globalScope.marginForSmallCard), backgroundColor: '#EEE', height: getYdp(90) }}>
                <FlatList
                    numColumns={globalScope.numColumnForSmallCard}
                    data={this.state.tables}
                    // nextPage={this.props.nextOrderPage}
                    renderItem={this.renderTableCard}
                    // onEndReached={() => { alert('on end reach'); }}
                    // onEndReachedThreshold={0.3}
                    // onViewableItemsChanged={this.props.onViewChanged}
                    keyExtractor={(item, index) => index}
                />
                <ModalWrapper
                    position="right"
                    containerStyle={{ marginVertical: 100 }}
                    onRequestClose={() => this.setState({ showMenuScreen: false })}
                    style={{ flex: 1 }}
                    shouldAnimateOnRequestClose={true}
                    visible={this.state.showMenuScreen || false}
                >
                    {
                        this.state.tables && this.state.targetTabldIndex &&
                            <MenuScreen
                                orderedProducts={this.state.tables[this.state.targetTabldIndex].data.products}
                                onToggleMenu={() => this.setState({ showMenuScreen: false })}
                            />
                    }
                </ModalWrapper>
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
