import React, { Component, PropTypes } from 'react';
import { Column, Text } from '../components/base';
import { CLIENT_ERROR, NETWORK_ERROR, SERVER_ERROR } from 'apisauce';

class ErrorFlash extends Component {
  render() {
    if (!!this.props.error) {
      const error = this.error();

      return (
        <Column
          center
          style={{
            backgroundColor: error.color,
            flex: 0,
            height: 30,
            padding: 6
          }}
        >
          <Text color="#fff">{error.message}</Text>
        </Column>
      );
    } else {
      return <Column style={{ flex: 0 }} />;
    }
  }

  error() {
    let error = {
      color: 'red',
      message: this.props.error
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

ErrorFlash.propTypes = {
  error: PropTypes.string
};

export default ErrorFlash;
