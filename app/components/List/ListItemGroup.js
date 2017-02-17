import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import style from '../Styles/List/ListItemGroup';
import Touchable from '../Touchable';
import { Text } from '../Styles'

class ListItemGroup extends Component {

    constructor(props) {
        super(props);
        const style = {};
        if (this.props.padding) {
            style.paddingHorizontal = 16;
            style.paddingBottom = 8;
        }
        this.padding = style;
    }

    render() {
        return (
            <View style={style.margin}>
            <Touchable style={style.group}
                onPress={this.props.onPress}
                onLongPress={this.props.onLongPress}>
                { !!this.props.name && (
                    <Text 
                        center={this.props.center}
                        style={[style.header, { color: this.props.color }]}>
                        { this.props.name }
                    </Text>
                )}
                <View style={this.padding}>
                    { this.props.children }
                </View>
            </Touchable>
            </View>
        );
    }
}


export default connect( state => ({
    color: state.settings.color
}))(ListItemGroup);

