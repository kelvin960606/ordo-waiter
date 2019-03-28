import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Button, AsyncStorage, SafeAreaView, Image, TouchableWithoutFeedback, Text, View } from 'react-native';
import { BarCodeScanner, Permissions, Icon } from 'expo';
import Layout from '../constants/Layout';
import { loginRequest } from '../redux/loginRedux';


class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  state = {
    hasCameraPermission: null,
    page: 'login',
    isScanDone: false,
  }

  async componentDidMount() {
    this.isMounted = true;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.props.dispatch(loginRequest('Hello'));
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  renderContent = () => {
    switch (this.state.page) {
      case 'login':
        return (
          <TouchableWithoutFeedback
            onPress={() => this.setState({ page: 'barcode'})}
          >
          <Image
            source={require('../assets/images/login.png')}
            resizeMode="stretch"
            style={{ height: Layout.window.height, width: Layout.window.width }}
          />
        </TouchableWithoutFeedback>
        );
      case 'barcode':
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
          return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        }
        return (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <BarCodeScanner
              onBarCodeScanned={this.handleBarCodeScanned}
              style={StyleSheet.absoluteFill}
            >
             <View style={styles.layerTop} >
              <TouchableWithoutFeedback
                onPress={() => {this.setState({ page: 'login' })}}
              >
                <Icon.Ionicons
                  name="ios-close-circle"
                  size={30}
                  style={{ marginTop: 30, marginLeft: 20 }}
                  color="white"
                />
              </TouchableWithoutFeedback>
             </View>
             <Text style={styles.qrTitle}>Scan the ID QR code</Text>
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                  <View style={[styles.focused, { borderColor: this.state.isScanDone ? 'green' : 'transparent', borderWidth: 4 }]} />
                  <View style={styles.layerRight} />
                </View>
                <Text style={[styles.qrTitle, {color: this.state.isScanDone ? 'green' : 'white' }]}>{this.state.isScanDone ? 'success' : 'scanning...'}</Text>
              <View style={styles.layerBottom} />
            </BarCodeScanner>
          </View>
        );
      default:
        break;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderContent()}
      </SafeAreaView>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ isScanDone: true });
    this._signInAsync();
    setTimeout(() => {
      this.setState({ isScanDone: false });
    }, 1000);
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}
const opacity = 'rgba(0, 0, 0, 1)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  },
  qrTitle: {
    backgroundColor: opacity,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)

