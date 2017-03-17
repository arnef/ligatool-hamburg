import React, { Component, PropTypes } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import * as theme from '../theme.js';

class Item extends Component {

    render() {
        const { icon, maxHeight, disabled, onPress, active, last } = this.props;
        const Container = onPress && !disabled ? Touchable : View;
        const separatorStyle = [styles.separator];
        const itemStyle = [styles.item];
        if (icon) {
            separatorStyle.push({ marginLeft: 64 })
        }
        
        if (maxHeight) {
            itemStyle.push({ height: maxHeight});
        }

        if (disabled) {
            itemStyle.push(styles.disabled);
        }

        return (
            <View style={ active ? {backgroundColor: theme.backgroundColor} : {}}>
                <Container onPress={onPress} style={itemStyle}>
                    { this.props.children }
                </Container>
                { !last && (<View style={separatorStyle} />)}
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
    onPress: PropTypes.func,
    last: PropTypes.bool,
    icon: PropTypes.bool,
    disabled: PropTypes.bool,
    maxHeight: PropTypes.number,
    active: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.object
    ])
}

const styles = StyleSheet.create({
   text: {
       color: theme.primaryTextColor
   },
   disabled: {
       opacity: .5
   },
   item: Platform.select({
       ios: {
           paddingHorizontal: 16,
           height: 44,
           flexDirection: 'row',
           alignItems: 'center'
       },
       android: {
           borderWidth: 0,
           paddingHorizontal: 16,
           height: 48,
           flex: 1,
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

