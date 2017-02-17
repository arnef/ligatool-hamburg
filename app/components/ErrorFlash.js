import React, { Component } from 'react';
import { Column, Text } from './Styles';
import { CLIENT_ERROR, NETWORK_ERROR, SERVER_ERROR} from 'apisauce';


class ErrorFlash extends Component {

    render() {
        if (!!this.props.error) {
            const error = this.error();
            return (
                <Column center style={{ height: 30, padding: 6, backgroundColor: error.color, flex: 0}}>
                    <Text color='#fff'>{ error.message }</Text>
                </Column>
            );
        } else {
              return (<Column style={{flex: 0}}/>);
        }
        
    }

    error() {
        let error = {
            message: this.props.error,
            color: 'red'
        };
        switch (this.props.error) {
            case CLIENT_ERROR:
                error.message = 'Fehler vom Client.'
                break;
            case SERVER_ERROR:
                error.message = 'Fehler beim Server';
                break;
            case NETWORK_ERROR:
                error.message = 'Keine Verbindung zum Server';
                error.color = 'orange'
                break;
        }
        return error;
    }
}

export default ErrorFlash;