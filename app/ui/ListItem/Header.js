import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Text from '../Text';
import Icon from '../Icon';
import Touchable from '../Touchable';
import * as theme from '../theme';

class ListItemHeader extends Component {

    render() {
        const Container = this.props.toggleMenu ? Touchable : View;
        return (
            <View style={styles.separator}>
                <Container onPress={this.props.toggleMenu}>
                    <View style={styles.header}>
                    <Text bold size={14} 
                        style={styles.text}
                        color={this.props.color}>{ this.props.title }</Text>
                        <View style={{flex: 1}} />
                    { this.props.toggleMenu && (
                        <Icon name={this.props.menuOpen ? this.props.closeIcon ? this.props.closeIcon : 'caret-up' : 'caret-down'} size={18} 
                            style={{marginRight: 10, textAlign: 'right'}}
                            color={theme.secondaryTextColor} />
                    )}
                    </View>
                </Container>
            </View>
        )
    }
}

ListItemHeader.propTypes = {
    title: React.PropTypes.string.isRequired,
    color: React.PropTypes.string
};

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: theme.backgroundColor,
        
    },
    text: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 9
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default connect(state => ({
    color: state.settings.color
}))(ListItemHeader);