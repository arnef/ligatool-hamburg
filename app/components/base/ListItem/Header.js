import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Text from '../Text';
import Icon from '../Icon';
import Touchable from '../Touchable';
import * as theme from '../theme';

class ListItemHeader extends Component {

    render() {
        const Container = this.props.toggleMenu ? Touchable : View;
        const headerTextStyle = [styles.headerText];
        return (
            <View style={[styles.separator, {borderBottomWidth: this.props.hideSeparator ? 0 : 1}]}>
                <Container onPress={this.props.toggleMenu}>
                    <View style={styles.header}>
                    <Text bold size={14} 
                        style={headerTextStyle}
                        color={this.props.color}>{ this.props.title }</Text>
                        <View style={{flex: 1}} />
                    { this.props.toggleMenu && (
                        <Icon name={this.props.menuOpen ? this.props.closeIcon ? this.props.closeIcon : 'caret-up' : 'caret-down'} size={18} 
                            style={{marginRight: 10, textAlign: 'right'}}
                            color={theme.secondaryTextColor} />
                    )}
                    </View>
                    
                    { this.props.children && (<Text secondary size={12}
                    style={styles.subHeaderText}>{this.props.children}</Text>)}
                    
                </Container>
            </View>
        )
    }
}

ListItemHeader.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.string
};

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: theme.backgroundColor,
    },
    headerText: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 9
    },
    subHeaderText: {
        marginHorizontal: 10,
        marginBottom: 10,
        marginTop: -8
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default connect(state => ({
    color: state.settings.color
}))(ListItemHeader);