import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import * as theme from '../theme.js';

class Item extends Component {

    render() {
        const Container = this.props.onPress && !this.props.disabled ? Touchable : View;
        const separatorStyle = [styles.separator];
        const itemStyle = [styles.item];
        if (this.props.icon) {
            separatorStyle.push({ marginLeft: Platform.OS === 'ios' ? 61 : 52 })
        }
        const styleItem = [styles.content];
        if (this.props.disabled) {
            styleItem.push(styles.disabled);
        }
        
        if (this.props.maxHeight) {
            itemStyle.push({ height: this.props.maxHeight, paddingVertical: 8});
        }
        return (
            <View style={ this.props.active ? {backgroundColor: '#eee'} : {}}>
                <Container onPress={this.props.onPress}>
                    <View style={itemStyle}>
                        <View style={styleItem}>
                            { this.props.children }
                        </View>
                    </View>
                </Container>
                { !this.props.last && (<View style={separatorStyle} />)}
            </View>
        )
    }
}

Item.defaultProps = {
    last: false,
    icon: false,
    disabled: false,
    maxHeight: 0,
    active: false
};

Item.propTypes = {
    onPress: React.PropTypes.func,
    last: React.PropTypes.bool,
    icon: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    maxHeight: React.PropTypes.number,
    active: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object
    ])
}

const styles = StyleSheet.create({
   text: {
       color: theme.primaryTextColor
   },
   content: {
       flexDirection: 'row',
       alignItems: 'center',
       borderWidth: 0
   },
   disabled: {
       opacity: .5
   },
   item: Platform.select({
       ios: {
           paddingVertical: 12,
           paddingHorizontal: 16,
           height: 44,
           flexDirection: 'row',
           alignItems: 'center'
       },
       android: {
           paddingVertical: 12,
           paddingHorizontal: 16,
           height: 48,
           flexDirection: 'row',
           alignItems: 'center'
       }
   }),
    separator: Platform.select({
        ios: {
            height: 1,
            marginLeft: 16,
            backgroundColor: theme.backgroundColor
        },
        android: {
            height: 1,
            marginLeft: 0,
            backgroundColor: theme.backgroundColor
        }
    })
});

export default Item;

