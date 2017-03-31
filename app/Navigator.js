import { StackNavigator } from 'react-navigation'

import Login from './modals/LoginModal'
import App from './AppNavigator'
import { backgroundColor } from './components/base/theme'


export default StackNavigator({
    App: { screen: App },
    Login: { screen: Login }
}, {
    cardStyle: { backgroundColor },
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: 'App'
})