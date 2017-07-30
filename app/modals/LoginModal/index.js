import { StackNavigator } from 'react-navigation';
import SelectGroupView from './SelectGroupView';
import SelectTeamView from './SelectTeamView';
import LoginView from './LoginView';
import NavHeader from '../../Nav/NavHeader';
import NavCloseIcon from '../../Nav/NavCloseIcon';

import S from '../../lib/strings';

const NavStack = StackNavigator(
  {
    SelectGroup: {
      screen: SelectGroupView,
      navigationOptions: NavCloseIcon(S.SELECT_GROUP),
    },
    SelectTeam: {
      screen: SelectTeamView,
      navigationOptions: { title: S.SELECT_TEAM },
    },
    LoginView: {
      screen: LoginView,
      navigationOptions: NavCloseIcon(S.LOGIN),
    },
  },
  NavHeader,
);

export default NavStack;
