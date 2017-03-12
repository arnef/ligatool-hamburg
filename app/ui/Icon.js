import React, { Component } from 'react';
import { Platform } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import * as theme from './theme';


class Icon extends Component {

    render() {
        let iconName = Platform.OS === 'android' ? 
            `md-${this.props.name}` : `ios-${this.props.name}-outline`;
        
        if (this.props.name === 'caret-down') {
            iconName = 'ios-arrow-down-outline';
        }
        if (this.props.name === 'caret-up') {
            iconName = 'ios-arrow-up-outline';
        }
        if (this.props.name === 'caret-forward') {
            iconName = 'ios-arrow-forward-outline';
        }
        if (this.props.name === 'close') {
            iconName = 'md-close';
        }
        const iconStyle = [{ width: this.props.size, height: this.props.size}];
        if (this.props.style) {
            iconStyle.push(this.props.style);
        }
        return (
            <IonIcon name={iconName}
                style={iconStyle}
                size={this.props.size}
                color={this.props.color} />
        )
    }
}

Icon.defaultProps = {
    color: theme.primaryTextColor
};

Icon.propTypes = {
    name: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    color: React.PropTypes.string,
    style: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object
    ])
};

export default Icon;