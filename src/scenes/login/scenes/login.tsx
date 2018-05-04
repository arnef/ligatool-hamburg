/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { Content, ListItem, Button, Text } from '../../../components';
import t from 'tcomb-form-native';
import { Strings } from 'src/lib/strings';
import { login } from '../../../redux/modules/auth';
import { getColor } from '../../../redux/modules/user';
import { hideLogin } from '../../../redux/modules/navigation';

const Form = t.form.Form;

const LoginForm = t.struct({
  username: t.String,
  password: t.String,
});

const formStyles = {
  ...Form.stylesheet,
  controlLabel: {
    normal: {
      color: '#474747',
      fontSize: 14,
    },
    error: {
      color: '#a94442',
    },
  },
};

const options = {
  fields: {
    username: {
      label: Strings.USERNAME,
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    password: {
      label: Strings.PASSWORD,
      secureTextEntry: true,
    },
  },
  stylesheet: formStyles,
};

interface Props extends StateProps, DispatchProps {}

export class LoginScene extends React.Component<Props> {
  _form: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: null,
      options,
    };
  }

  private handleSubmit = () => {
    const value = this._form.getValue();
    console.log(value);
    if (value) {
      this.setState({ value });
      this.props.login(value);
    }
  };

  public render() {
    return (
      <Content>
        <ListItem.Group>
          <View style={styles.container}>
            {this.props.loading && (
              <ActivityIndicator
                color={this.props.color}
                style={{ paddingBottom: 20 }}
              />
            )}
            <Text>{Strings.LOGIN_INFO}</Text>
          </View>
          <View style={styles.container}>
            <Form
              type={LoginForm}
              options={{
                ...options,
                fields: {
                  ...options.fields,
                  username: {
                    ...options.fields.username,
                    editable: !this.props.loading,
                  },
                  password: {
                    ...options.fields.password,
                    editable: !this.props.loading,
                  },
                },
              }}
              value={this.state.value}
              ref={c => (this._form = c)}
            />
          </View>

          {!!this.props.error && (
            <Text color={'#a94442'} style={styles.errorMessage}>
              {Strings.LOGIN_ERROR}
            </Text>
          )}
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title={Strings.SKIP}
                disabled={this.props.loading}
                onPress={this.props.close}
                outline
              />
            </View>
            <View style={styles.button}>
              <Button
                title={Strings.LOGIN}
                onPress={this.handleSubmit}
                disabled={this.props.loading}
              />
            </View>
          </View>
        </ListItem.Group>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttons: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  errorMessage: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

interface StateProps {
  loading: boolean;
  error: string | null;
  color: string;
}
interface DispatchProps {
  login: Function;
  close: Function;
}

function mapStateToProps(state: any): StateProps {
  return {
    loading: state.loading.list,
    error: state.loading.error,
    color: getColor(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    login: (user: any) => dispatch(login(user, null)),
    close: () => dispatch(hideLogin(null)),
  };
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginScene);
