import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import { Text } from 'react-native';
import { getXdp } from 'app/globalUtils';

import MyAppScreen from '../containers/MyAppScreen';
import LoginScreen from '../containers/LoginScreen';
import MenuScreen from '../containers/MenuScreen';
import AuthLoadingScreen from '../containers/AuthLoadingScreen';
import KitchenScreen from '../containers/KitchenScreen';

const AppStack = createStackNavigator({
    MyApp: MyAppScreen,
    Menu: MenuScreen,
    Kitchen: KitchenScreen,
});
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));

console.disableYellowBox = true;
