/**
 *
 * MyAppScreen
 *
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import firebase from 'react-native-firebase';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectMyAppScreen from './selectors';
import reducer from './reducer';
import saga from './saga';

export class MyAppScreen extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('merchants').doc('1').collection('branches').doc('1');
        this.unsubscribe = null;
        this.state = {
            tables: null,
        };
    }

    componentDidMount() {
        try {
            // should change to normal signIn
            firebase.auth().signInAnonymously()
                .then((user) => {
                    alert(JSON.stringify(user));
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
            this.setState({ tables: tb });
        } else {
            console.log('document not found');
        }
    }

    render() {
        return (
            <View>
                <Text>{JSON.stringify(this.state.tables)}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
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
