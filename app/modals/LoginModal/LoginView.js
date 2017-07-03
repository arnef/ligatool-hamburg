import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Container } from '../../components';
import {
  ListItem,
  Row,
  Column,
  Button,
  Text,
  Content,
  Separator,
} from '../../components/base';
import * as theme from '../../components/base/theme';
import strings from '../../Strings';
import * as NavigationActions from '../../redux/modules/navigation';
import * as AuthActions from '../../redux/modules/auth';
import * as MyTeamActions from '../../redux/modules/myteam';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: '',
      user: '',
    };
    this.passwordInput = null;
  }

  render() {
    const { loading, error } = this.props;
    const init = this.props.navigation.state.key.indexOf('Init') !== -1;

    const isIOS = Platform.OS === 'ios';
    const Wrapper = isIOS ? View : Content;
    return (
      <Container>
        <ListItem.Group>
          <Content>
            <Text>
              {strings.login_info}
            </Text>
          </Content>
          <Wrapper>
            {isIOS && <Separator full />}
            <TextInput
              placeholder="Username"
              autoCapitalize="none"
              style={styles.input}
              underlineColorAndroid={theme.backgroundColor}
              editable={!loading}
              blurOnSubmit={false}
              autoCorrect={false}
              selectTextOnFocus={true}
              onChangeText={text => {
                this.setState({ user: text });
              }}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              returnKeyLabel="next"
            />
            {isIOS && <Separator />}
            <TextInput
              placeholder="Passwort"
              ref={ref => (this.passwordInput = ref)}
              style={styles.input}
              selectTextOnFocus={true}
              underlineColorAndroid={theme.backgroundColor}
              editable={!loading}
              secureTextEntry={true}
              keyboardAppearance="dark"
              onChangeText={text => {
                this.setState({ pass: text });
              }}
              onSubmitEditing={this.login.bind(this)}
              returnKeyType="send"
            />
            {isIOS && <Separator full />}
          </Wrapper>
          {!loading &&
            <Content>
              <Row>
                <Column>
                  <Button
                    outline
                    onPress={() => {
                      this.closeLogin();
                    }}
                    title={init ? 'Abbrechen' : 'Überspringen'}
                  />
                </Column>
                <Column fluid style={{ width: 8 }} />
                <Column>
                  <Button
                    disabled={!this.state.user || !this.state.pass}
                    onPress={this.login.bind(this)}
                    title="Anmelden"
                  />
                </Column>
              </Row>
            </Content>}
          {loading &&
            <Content>
              <Row center>
                <ActivityIndicator color={this.props.color} size={'large'} />
              </Row>
            </Content>}
        </ListItem.Group>
        {!loading &&
          error &&
          <Content>
            <Text color="red" center>
              {strings.login_error}
            </Text>
          </Content>}
      </Container>
    );
  }

  closeLogin() {
    const next = this.props.navigation.state.params
      ? this.props.navigation.state.params.next
      : null;
    this.props.hideLogin(next);
  }

  login() {
    if (this.state.user !== '' && this.state.pass !== '') {
      const loginUser = {
        password: this.state.pass,
        username: this.state.user,
      };
      const next = this.props.navigation.state.params
        ? this.props.navigation.state.params.next
        : null;
      this.props.login(loginUser, next);
    }
  }
}

const styles = StyleSheet.create({
  input: Platform.select({
    ios: {
      height: 40,
      marginLeft: 16,
    },
    android: {
      marginLeft: -2,
      marginRight: -2,
    },
  }),
});

export default connect(
  state => ({
    auth: state.auth,
    error: state.loading.error,
    loading: state.loading.list,
    color: state.settings.color,
  }),
  dispatch => ({
    hideLogin: next => dispatch(NavigationActions.hideLogin(next)),
    login: (user, next) => dispatch(AuthActions.login(user, next)),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    // queryTeamMatches: () => dispatch(actions.queryTeamMatches()),
    // renewToken: apiKey => dispatch(actions.renewToken(apiKey)),
    // requestAPIKey: user => dispatch(actions.requestAPIKey(user)),
    // showLogin: show => dispatch(NavigationActions.hideLogin()),
    // navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(LoginView);
