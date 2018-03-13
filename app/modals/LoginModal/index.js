import { StackNavigator } from 'react-navigation';
import SelectGroupView from './SelectGroupView';
import SelectTeamView from './SelectTeamView';
import LoginView from './LoginView';
import NavHeader from '../../Nav/NavHeader';
import NavCloseIcon from '../../Nav/NavCloseIcon';
import S from '../../lib/strings';
import { getNavigationStateParams } from '../../redux/modules/navigation';

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
      navigationOptions: args => {
        if (
          getNavigationStateParams(args.navigation) &&
          getNavigationStateParams(args.navigation).init
        ) {
          return NavCloseIcon(S.LOGIN)(args);
        } else {
          return { title: S.LOGIN };
        }
      },
    },
  },
  NavHeader,
);

export default NavStack;
