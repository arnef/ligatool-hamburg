import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Container } from '../../components';
import {
  Card,
  ListItem,
  Row,
  Column,
  Button,
  Text,
  Content,
  Separator
} from '../../components/base';
import * as theme from '../../components/base/theme';
import { CLIENT_ERROR } from 'apisauce';
import NavCloseIcon from '../../Nav/NavCloseIcon';
import strings from '../../Strings';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: '',
      user: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.apiKeyFullfilled(nextProps);
  }

  render() {
    const { loading, error } = this.props;
    const init = this.props.navigation.state.key === 'Init';
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
            ref="UserInput"
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
              this.refs.PassInput.focus();
            }}
            returnKeyLabel="next"
          />
          {isIOS && <Separator />}
          <TextInput
            placeholder="Passwort"
            ref="PassInput"
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
                      this.props.showLogin(false);
                      if (!init) {
                        this.props.queryTeamMatches();
                      }
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
          error === CLIENT_ERROR &&
          <Content>
            <Text color="red" center>
              {strings.login_error}
            </Text>
          </Content>}
      </Container>
    );
  }

  login() {
    if (this.state.user !== '' && this.state.pass !== '') {
      const loginUser = {
        password: this.state.pass,
        username: this.state.user
      };

      this.props.requestAPIKey(loginUser);
    }
  }

  apiKeyFullfilled(nextProps) {
    if (this.props.auth.api_key === null && nextProps.auth.api_key !== null) {
      nextProps.renewToken(nextProps.auth.api_key);
      nextProps.queryTeamMatches();
    }
  }
}

const styles = StyleSheet.create({
  input: Platform.select({
    ios: {
      height: 40,
      marginLeft: 16
    },
    android: {
      marginLeft: -2,
      marginRight: -2
    }
  })
});

LoginView.navigationOptions = {
  title: 'Login',
  header: (navigation, defaultHeader) => {
    if (navigation.state.key === 'Init') {
      return NavCloseIcon(navigation, defaultHeader);
    } else {
      return defaultHeader;
    }
  }
};

export default connect(
  state => ({
    auth: state.auth,
    error: state.loading.error,
    loading: state.loading.nonBlocking,
    color: state.settings.color
  }),
  dispatch => ({
    queryTeamMatches: () => dispatch(actions.queryTeamMatches()),
    renewToken: apiKey => dispatch(actions.renewToken(apiKey)),
    requestAPIKey: user => dispatch(actions.requestAPIKey(user)),
    showLogin: show => dispatch(actions.showLogin(show))
  })
)(LoginView);
