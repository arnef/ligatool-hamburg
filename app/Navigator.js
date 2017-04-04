import { StackNavigator } from 'react-navigation'

import Login from './modals/LoginModal'
import App from './AppNavigator'
import InitScreen from './components/LoadingScreen'
import { backgroundColor } from './components/base/theme'


export default StackNavigator({
    App: { screen: App },
    Login: { screen: Login },
    Splash: { screen: InitScreen }
}, {
    cardStyle: { backgroundColor },
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: 'Splash'
})