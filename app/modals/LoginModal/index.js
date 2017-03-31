// import LoginModal from './LoginModal'

// export default LoginModal
import { StackNavigator } from 'react-navigation'
import SelectGroupView from './SelectGroupView'
import SelectTeamView from './SelectTeamView'
import LoginView from './LoginView'
import NavHeader from '../../Nav/NavHeader'

const NavStack = StackNavigator({
    SelectGroup: { screen: SelectGroupView },
    SelectTeam: { screen: SelectTeamView },
    Login: { screen: LoginView }
}, {
    navigationOptions: {
        header: NavHeader
    }
})

export default NavStack
