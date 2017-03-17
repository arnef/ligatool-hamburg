import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

class Icon extends Component {

    render() {
        let iconName = Platform.OS === 'android' ? 
            `md-${this.props.name}` : this.props.name.indexOf('outline') === -1 ?
            `ios-${this.props.name}-outline` : `ios-${this.props.name}`;
        
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
        const iconStyle = [styles.icon, { width: this.props.size, height: this.props.size}];
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

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        borderWidth: 0
    }
})

Icon.propTypes = {
    name: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    color: React.PropTypes.string,
    style: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object, React.PropTypes.number
    ])
};

export default Icon;