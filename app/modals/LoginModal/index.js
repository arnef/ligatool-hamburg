import { StackNavigator } from 'react-navigation';
import SelectGroupView from './SelectGroupView';
import SelectTeamView from './SelectTeamView';
import LoginView from './LoginView';
import NavHeader from '../../Nav/NavHeader';
import NavCloseIcon from '../../Nav/NavCloseIcon';

const NavStack = StackNavigator(
  {
    SelectGroup: {
      screen: SelectGroupView,
      navigationOptions: NavCloseIcon('Gruppe wählen')
    },
    SelectTeam: {
      screen: SelectTeamView,
      navigationOptions: { title: 'Team wählen'}
    },
    LoginView: {
      screen: LoginView,
      navigationOptions: NavCloseIcon('Login')
    },
  },
  NavHeader,
);

export default NavStack;
