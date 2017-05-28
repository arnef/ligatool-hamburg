import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Column,
  Text,
  Content,
  Touchable,
  Icon,
  Row,
} from '../components/base';
import { CLIENT_ERROR, NETWORK_ERROR, SERVER_ERROR } from 'apisauce';

class ErrorFlash extends Component {
  render() {
    if (this.props.error) {
      const error = this.error();

      return (
        <View style={{ backgroundColor: error.color }}>
          <Touchable onPress={this.props.onRefresh}>
            <Content>
              <Row center>
                <Column>
                  <Text color="#fff">{error.message}</Text>
                </Column>
                <Column fluid>
                  <Icon color="#fff" name="refresh" size={22} />
                </Column>
              </Row>
            </Content>
          </Touchable>
        </View>
      );
    } else {
      return <Column style={{ flex: 0 }} />;
    }
  }

  error() {
    let error = {
      color: 'red',
      message: this.props.error,
    };

    switch (this.props.error) {
      case CLIENT_ERROR:
        error.message = 'Verbindungsfehler';
        break;
      case SERVER_ERROR:
        error.message = 'Serverprobleme';
        break;
      case NETWORK_ERROR:
        error.message = 'Keine Internetverbindung';
        error.color = 'orange';
        break;
    }

    return error;
  }
}

export default ErrorFlash;
