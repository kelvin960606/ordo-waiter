import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import MyAppScreen from '../containers/MyAppScreen';
import LoginScreen from '../containers/LoginScreen';
import AuthLoadingScreen from '../containers/AuthLoadingScreen';


const AppStack = createStackNavigator({ MyApp: MyAppScreen });
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