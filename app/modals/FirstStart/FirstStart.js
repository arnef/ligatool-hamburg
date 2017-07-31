// @flow
import React from 'react';
import { View, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import NavHeader from '../../Nav/NavHeader';
import { Container, Text, Button } from '../../components';
import S from '../../lib//strings';
import styles from './styles';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import SelectGroup from '../LoginModal/SelectGroupView';
import SelectTeam from '../LoginModal/SelectTeamView';
import Login from '../LoginModal/LoginView';
import SettingsNotification from '../../routes/SettingsNotification';
class FirstStart extends React.Component {
  render() {
    return (
      // <Container style={{ flex: 1}}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: 'loading' }} style={styles.icon} />
          <Text>Moin Moin</Text>
          <Text style={{ padding: 32 }}>
            Im Folgenden kannst du nun die App einrichten. Wähle in den nächsten
            Schritten dein Team aus, um alle Informationen auf einen Blick zu
            haben. Des Weiteren kannst du einstellen. für welche Gruppen dir
            Benachrichtigungen geschickt werden.
          </Text>

          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button onPress={this.props.skip} title={S.SKIP} outline />
            </View>
            <View style={styles.button}>
              <Button title={'Einrichten'} onPress={this.props.next} />
            </View>
          </View>
        </View>
      </View>
      // </Container>
    );
  }
}

export default StackNavigator(
  {
    Welcome: {
      screen: connect(
        state => ({}),
        (dispatch: Dispatch<any>) => ({
          skip: () => dispatch(NavigationActions.hideStart()),
          next: () =>
            dispatch(NavigationActions.navigate({ routeName: 'SelectGroup' })),
        }),
      )(FirstStart),
      navigationOptions: { header: null, gesturesEnabled: false },
    },
    SelectGroup: {
      screen: SelectGroup,
      navigationOptions: {
        title: S.SELECT_GROUP,
        gesturesEnabled: false,
      },
    },
    SelectTeam: {
      screen: SelectTeam,
      navigationOptions: { title: S.SELECT_TEAM, gesturesEnabled: false },
    },
    LoginView: {
      screen: Login,
      navigationOptions: { title: S.LOGIN, gesturesEnabled: false },
    },
    SetupNotif: {
      screen: SettingsNotification,
      navigationOptions: { title: S.NOTIFICATIONS, gesturesEnabled: false },
    },
  },
  NavHeader,
);
