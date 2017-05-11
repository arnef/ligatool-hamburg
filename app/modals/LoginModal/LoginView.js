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
import { ListItem, Row, Column, Button, Text } from '../../components/base';
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

    return (
      <Container>
        <ListItem.Group>
          <Row style={{ paddingTop: 6 }}>
            <Text>
              {strings.login_info}
            </Text>
          </Row>
          <Row>
            <Column>
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
              <View style={styles.separator} />
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
            </Column>
          </Row>
          {!loading &&
            <Row style={{ paddingBottom: 0 }}>
              <Column>
                <Button
                  onPress={() => {
                    this.props.showLogin(false);
                    if (!init) {
                      this.props.queryTeamMatches();
                    }
                  }}
                >
                  {init ? 'Abbrechen' : 'Überspringen'}
                </Button>
              </Column>
              <Column fluid style={{ width: 8 }} />
              <Column>
                <Button
                  disabled={!this.state.user || !this.state.pass}
                  onPress={this.login.bind(this)}
                >
                  Anmelden
                </Button>
              </Column>
            </Row>}
          {!loading && error === CLIENT_ERROR &&
            <Row>
              <Text color="red">
                {strings.login_error}
              </Text>
            </Row>}
          {loading &&
            <Row center>
              <Column style={{ marginVertical: 16 }}>
                <ActivityIndicator color={this.props.color} />
              </Column>
            </Row>}
        </ListItem.Group>
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
      height: 40
    },
    android: {
      marginLeft: -2,
      marginRight: -2
    }
  }),
  separator: Platform.select({
    ios: {
      backgroundColor: theme.backgroundColor,
      height: 1
    },
    android: { height: 0 }
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
