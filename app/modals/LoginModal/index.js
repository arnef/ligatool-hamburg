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
    ...NavHeader
})

export default NavStack
