import React, { Component } from 'react';
import { Platform } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

class Icon extends Component {

    render() {
        const icon = Platform.OS === 'ios' ? `ios-${this.props.name}-outline` : `md-${this.props.name}`;
        const color = this.props.color || '#aaa';
        const style = this.props.style || {};
        return (
            <IonIcon name={icon}
                     size={this.props.size}
                     style={style}
                     onPress={this.props.onPress ? this.props.onPress : null}
                     color={color} />
        );
    }
}

Icon.propTypes = {
    name: React.PropTypes.string,
    size: React.PropTypes.number,
    color: React.PropTypes.string,
    // style: React.PropTypes.object
};

export default Icon;