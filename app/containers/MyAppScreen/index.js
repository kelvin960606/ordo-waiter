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

const numColSmallCard = globalScope.numColumnForSmallCard;
// const marginSmallCard = globalScope.marginForSmallCard;
// const paddingSmallCard = globalScope.paddingForSmallCard;

export class MyAppScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity
                className="logout-button"
                style={{ width: getXdp(4) }}
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
                    style={{ marginRight: 10, padding: 10, height: getXdp(4), width: getXdp(4), tintColor: 'tomato' }}
                    source={{ uri: 'https://img.icons8.com/material/48/000000/logout-rounded.png' }}
                />
            </TouchableOpacity>
        ),
        headerLeft: (
            <TouchableOpacity
                className="logout-button"
                onPress={async () => {
                    navigation.navigate('Kitchen');
                }}
            >
                <Text style={{ padding: 10 }}>Kitchen</Text>
            </TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('merchants').doc('1').collection('branches').doc('1');
        this.unsubscribe = null;
        this.state = {
            tables: [],
            targetTableIndex: null,
            editPaxTableIndex: null,
            showSelectPax: false,
        };
    }

    componentDidMount() {
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
        } else {
            console.log('document not found');
        }
    }

    managePaxCount = ({ value, target }) => {
        if (value < 0) {
            return;
        }
        const targetTableIndex = target !== null && target !== undefined ? target : this.state.editPaxTableIndex;
        const list = [...this.state.tables];
        const data = { ...this.state.tables[targetTableIndex].data };
        data.pax = value;
        const table = { ...this.state.tables[targetTableIndex], data };
        list[targetTableIndex] = table;

        this.setState({
            tables: list,
        });
    }

    goMenuScreen = (index) => {
        if (index !== null && index !== undefined) {
            this.setState({
                showMenuScreen: true,
                showSelectPax: false,
                editPaxTableIndex: null,
                targetTableIndex: index,
            });
        }
    }

    renderTableCard = ({ item, index }) => {
        const status = dataChecking(item, 'data', 'pax');

        return (
            <TouchableOpacity
                onPress={() => {
                    if (!status) {
                        this.setState({
                            showSelectPax: true,
                            showMenuScreen: false,
                            editPaxTableIndex: index,
                            targetTableIndex: null,
                        });
                        return;
                    }

                    this.goMenuScreen(index);
                }}
            >
                <View
                    style={{
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / numColSmallCard),
                        width: getXdp((100 - 2 - (4 * globalScope.marginForSmallCard) - (2 * globalScope.paddingForSmallCard)) / numColSmallCard),
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
                            {dataChecking(item, 'key')}
                        </Text>
                        {/* <Text
                            style={{ fontSize: getXdp(1) }}
                        >
                            Order Created
                        </Text> */}
                    </View>
                    {
                        status ?
                            <View className="top-left">
                                <Image source={require('../../assets/images/people.png')} style={{ tintColor: 'gray', width: getXdp(4), height: getXdp(4) }} />
                                <Text style={{ fontSize: getXdp(2) }}>{dataChecking(item, 'data', 'pax')}pax</Text>
                            </View>
                            :
                            null
                    }
                    {
                        status ?
                            <View
                                className="bottom-left"
                                style={{
                                    position: 'absolute',
                                    bottom: getXdp(2),
                                    left: getXdp(2),
                                }}
                            >
                                {
                                    dataChecking(item, 'data', 'payment', 'total') ?
                                        <PriceTag value={item.data.payment.total} />
                                        : null
                                }
                            </View>
                            :
                            null
                    }
                    {
                        status ?
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
                            :
                            null
                    }
                    {
                        !status ?
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
                            :
                            null
                    }
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { tables, targetTableIndex, editPaxTableIndex, showMenuScreen, showSelectPax } = this.state;

        return (
            <View style={{ padding: getXdp(globalScope.marginForSmallCard), backgroundColor: '#EEE', height: getYdp(90) }}>
                <FlatList
                    numColumns={numColSmallCard}
                    data={tables}
                    renderItem={this.renderTableCard}
                    keyExtractor={(item, index) => `${index}`}
                />
                <ModalWrapper
                    position="right"
                    containerStyle={{ marginVertical: 100 }}
                    onRequestClose={() => this.setState({ showMenuScreen: false, targetTableIndex: null })}
                    style={{ flex: 1 }}
                    shouldAnimateOnRequestClose={true}
                    visible={showMenuScreen || false}
                >
                    {
                        (tables && targetTableIndex !== null) ?
                            <MenuScreen
                                currentTableData={tables[targetTableIndex]}
                                onCloseMenu={() => {
                                    const target = this.state.targetTableIndex;
                                    this.setState({
                                        showMenuScreen: false,
                                        targetTableIndex: null,
                                    });
                                    this.managePaxCount({ value: 0, target, });
                                }}
                            />
                            :
                            <Text>Opps, something wrong...</Text>
                    }
                </ModalWrapper>

                {
                    this.state.showSelectPax &&
                        <TouchableOpacity
                            className="select-pax-modal-overlay"
                            onPress={() => this.setState({ showSelectPax: false, targetTableIndex: null })}
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
                        </TouchableOpacity>
                }
                {
                    this.state.showSelectPax &&
                        <View
                            className="select-pax-dialog"
                            style={{
                                backgroundColor: 'white',
                                position: 'absolute',
                                top: getYdp(30),
                                left: getXdp(20),
                                right: getXdp(20),
                                borderWidth: 3,
                                borderColor: '#E89558',
                                zIndex: 3,
                                padding: 25,
                                paddingTop: getYdp(3),
                            }}
                        >
                            {
                                editPaxTableIndex !== null && editPaxTableIndex.constructor === Number && tables[editPaxTableIndex] ?
                                    <View>
                                        <Text style={{ alignSelf: 'center', fontSize: getXdp(3) }}>Number of PAX</Text>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <TouchableOpacity
                                                style={{ paddingVertical: getXdp(1.5) }}
                                                onPress={() => this.managePaxCount({ value: this.state.tables[this.state.editPaxTableIndex].data.pax - 1 })}
                                            >
                                                <Image
                                                    style={{
                                                        paddingHorizontal: getXdp(6),
                                                        paddingVertical: getXdp(6),
                                                        margin: getXdp(2),
                                                        height: getXdp(5),
                                                        width: getXdp(5),
                                                        tintColor: this.state.tables[this.state.editPaxTableIndex].data.pax ? null : 'lightgray',
                                                    }}
                                                    source={require('../../assets/images/subtract.png')}
                                                />
                                            </TouchableOpacity>
                                            <Text
                                                style={{ paddingHorizontal: getXdp(6), paddingVertical: getXdp(5), margin: getXdp(2), fontSize: getXdp(3), borderColor: 'tomato', borderWidth: getXdp(0.4) }}
                                            >
                                                {dataChecking(tables, editPaxTableIndex, 'data', 'pax') || 0}
                                            </Text>
                                            <TouchableOpacity
                                                style={{ paddingVertical: getXdp(1.5) }}
                                                onPress={() => this.managePaxCount({ value: this.state.tables[this.state.editPaxTableIndex].data.pax + 1 })}
                                            >
                                                <Image
                                                    style={{ paddingHorizontal: getXdp(6), paddingVertical: getXdp(6), margin: getXdp(2), height: getXdp(5), width: getXdp(5) }}
                                                    source={require('../../assets/images/plus.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: getXdp(2.5),
                                                backgroundColor: '#DDDAFF',
                                                borderRadius: 25,
                                                marginTop: getXdp(5),
                                                marginHorizontal: getXdp(6),
                                            }}
                                            onPress={() => {
                                                if (this.state.tables[this.state.editPaxTableIndex].data.pax) {
                                                    this.goMenuScreen(this.state.editPaxTableIndex);
                                                }
                                            }}
                                        >
                                            <Text style={{ fontSize: getXdp(2.5), alignSelf: 'center' }}>Proceed</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                }
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
