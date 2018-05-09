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

import { Button, Content, ListItem, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import { login } from '@app/redux/modules/auth';
import { hideLogin } from '@app/redux/modules/navigation';
import { getColor } from '@app/redux/modules/user';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const LoginForm = t.struct({
  password: t.String,
  username: t.String,
});

const formStyles = {
  ...Form.stylesheet,
  controlLabel: {
    error: {
      color: '#a94442',
    },
    normal: {
      color: '#474747',
      fontSize: 14,
    },
  },
};

const options = {
  fields: {
    password: {
      label: Strings.PASSWORD,
      secureTextEntry: true,
    },
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
      label: Strings.USERNAME,
    },
  },
  order: ['username', 'password'],
  stylesheet: formStyles,
};

interface IProps extends IStateProps, IDispatchProps {}

export class LoginScene extends React.Component<
  IProps,
  { value: string; options: any }
> {
  private form: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      options,
      value: null,
    };
  }

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
                  password: {
                    ...options.fields.password,
                    editable: !this.props.loading,
                  },
                  username: {
                    ...options.fields.username,
                    editable: !this.props.loading,
                  },
                },
              }}
              value={this.state.value}
              ref={(c: any) => (this.form = c)}
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

  private handleSubmit = () => {
    const value = this.form.getValue();
    if (value) {
      this.setState({ value });
      this.props.login(value);
    }
  };
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorMessage: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});

interface IStateProps {
  loading: boolean;
  error: string | null;
  color: string;
}
interface IDispatchProps {
  login: (user: any) => void;
  close: () => void;
}

function mapStateToProps(state: any): IStateProps {
  return {
    color: getColor(state),
    error: state.loading.error,
    loading: state.loading.list,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    close: () => dispatch(hideLogin(null)),
    login: (user: any) => dispatch(login(user, null)),
  };
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginScene);
