import React, { Component, PropTypes } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Icon, Image } from '../components/base';
import * as theme from '../components/base/theme';

const iconSize = Platform.OS === 'ios' ? 29 : 24;
const bigIconSize = 42;

class TeamLogo extends Component {

    render() {
        const imageContainer = [styles.container];
        if (this.props.big) {
            imageContainer.push({
                width: bigIconSize,
                height: bigIconSize
            });
        }

        return (
            <View>
                { this.props.url && (<Image url={this.props.url} size={this.props.big ? bigIconSize : iconSize} />) }
                { !this.props.url && (<Icon style={styles.icon} size={this.props.big ? bigIconSize : iconSize} name='shirt' color={theme.secondaryTextColor} />) }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center'
    }
})

TeamLogo.defaultProps = {
    big: false,
    url: null
};

TeamLogo.propTypes = {
    big: PropTypes.bool,
    url: PropTypes.any
};

export default TeamLogo;
