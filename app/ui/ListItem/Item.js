import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import * as theme from '../theme.js';

class Item extends Component {

    render() {
        const Container = this.props.onPress && !this.props.disabled ? Touchable : View;
        const separatorStyle = [styles.separator];
        if (this.props.icon) {
            separatorStyle.push({ marginLeft: Platform.OS === 'ios' ? 61 : 52 })
        }
        const styleItem = [styles.content];
        if (this.props.disabled) {
            styleItem.push(styles.disabled);
        }
        return (
            <View>
                <Container onPress={this.props.onPress}>
                    <View style={styles.item}>
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
    disabled: false
};

Item.propTypes = {
    onPress: React.PropTypes.func,
    last: React.PropTypes.bool,
    icon: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
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
   },
   disabled: {
       opacity: .5
   },
   item: {
       paddingVertical: 12,
       paddingHorizontal: 16,
       height: Platform.select({
           ios: 44,
           android: 48
       })
    },
    separator: Platform.select({
        ios: {
            height: 1,
            marginLeft: 16,
            backgroundColor: theme.backgroundColor
        },
        android: {
            height: 0,
            marginLeft: 0,
            backgroundColor: theme.backgroundColor
        }
    })
});

export default Item;

