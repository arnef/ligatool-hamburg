import { StackNavigator } from 'react-navigation'

import Login from './modals/LoginModal'
import App from './AppNavigator'
import SelectPlayer from './modals/SelectPlayerModal'
import InitScreen from './components/LoadingScreen'
import { backgroundColor } from './components/base/theme'


export default StackNavigator({
    App: { screen: App },
    Login: { screen: Login },
    Splash: { screen: InitScreen },
    SelectPlayer: { screen: SelectPlayer }
}, {
    cardStyle: { backgroundColor },
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: 'Splash'
})