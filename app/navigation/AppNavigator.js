import { createStackNavigator, createAppContainer } from 'react-navigation';
import MyAppScreen from '../containers/MyAppScreen';
import LoginScreen from '../containers/LoginScreen';

const AppNavigator = createStackNavigator(
    {
        MyApp: MyAppScreen,
        Login: LoginScreen,
    },
    {
        initialRouteName: 'MyApp',
    }
);
export default createAppContainer(AppNavigator);
