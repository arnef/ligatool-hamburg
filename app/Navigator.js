import { StackNavigator } from 'react-navigation'


import App from './AppNavigator'
import ModalLogin from './modals/LoginModal'
import ModalSelectPlayer from './modals/SelectPlayerModal'
import Splash from './components/LoadingScreen'
import { backgroundColor } from './components/base/theme'
import { APP, SPLASH, MODAL_LOGIN, MODAL_SELECT_PLAYER } from './views/routes'

export default StackNavigator({
    [SPLASH]: { screen: Splash },
    [APP]: { screen: App },
    [MODAL_LOGIN]: { screen: ModalLogin },
    [MODAL_SELECT_PLAYER]: { screen: ModalSelectPlayer }
}, {
    cardStyle: { backgroundColor },
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: SPLASH
})
