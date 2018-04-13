import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Container, ListItem, Button, Text, Separator } from '../../components';
import S from '../../lib/strings';
import {
  navigate,
  hideLogin,
  getNavigationStateParams,
} from '../../redux/modules/navigation';
import * as AuthActions from '../../redux/modules/auth';

import { colors } from '../../config/styles';
import { getColor } from '../../redux/modules/user';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: '',
      user: '',
    };
    this.passwordInput = null;
    this.login = this.login.bind(this);
  }

  render() {
    const { loading, error } = this.props;
    const init =
      getNavigationStateParams(this.props.navigation) &&
      getNavigationStateParams(this.props.navigation).init;

    const isIOS = Platform.OS === 'ios';
    return (
      <Container>
        <ListItem.Group>
          <View style={{ padding: 12 }}>
            <Text>{S.LOGIN_INFO}</Text>
          </View>
          <View style={{ padding: isIOS ? 0 : 12 }}>
            {isIOS && <Separator full />}
            <TextInput
              placeholder={S.USERNAME}
              autoCapitalize="none"
              style={styles.input}
              underlineColorAndroid={colors.BACKGROUND}
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
              placeholder={S.PASSWORD}
              ref={ref => (this.passwordInput = ref)}
              style={styles.input}
              selectTextOnFocus={true}
              underlineColorAndroid={colors.BACKGROUND}
              editable={!loading}
              secureTextEntry={true}
              keyboardAppearance="dark"
              onChangeText={text => {
                this.setState({ pass: text });
              }}
              onSubmitEditing={this.login}
              returnKeyType="send"
            />
            {isIOS && <Separator full />}
          </View>
          {!loading && (
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.column}>
                  <Button
                    outline
                    onPress={() => {
                      this.closeLogin();
                    }}
                    title={init ? S.CANCEL : S.SKIP}
                  />
                </View>
                <View style={styles.buttonSpace} />
                <View style={styles.column}>
                  <Button
                    disabled={!this.state.user || !this.state.pass}
                    onPress={this.login}
                    title={S.LOGIN}
                  />
                </View>
              </View>
            </View>
          )}
          {loading && (
            <View style={{ padding: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator color={this.props.color} size={'large'} />
              </View>
            </View>
          )}
        </ListItem.Group>
        {!loading &&
          error && (
            <View style={{ padding: 12 }}>
              <Text color="red" center>
                {S.LOGIN_ERROR}
              </Text>
            </View>
          )}
      </Container>
    );
  }

  closeLogin() {
    this.props.hideLogin();
  }

  login() {
    if (this.state.user !== '' && this.state.pass !== '') {
      const loginUser = {
        password: this.state.pass,
        username: this.state.user,
      };
      this.props.login(loginUser, null);
    }
  }
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  buttonSpace: {
    width: 8,
  },
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
    color: getColor(state),
  }),
  dispatch => ({
    hideLogin: next => dispatch(hideLogin(next)),
    login: (user, next) => dispatch(AuthActions.login(user, next)),
    navigate: route => dispatch(navigate(route)),
  }),
)(LoginView);
