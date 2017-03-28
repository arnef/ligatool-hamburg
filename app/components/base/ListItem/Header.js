import React, { Component, PropTypes } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Text from '../Text'
import Icon from '../Icon'
import Touchable from '../Touchable'
import * as theme from '../theme'

class ListItemHeader extends Component {

    render() {
        const { toggleMenu, title, menuOpen, closeIcon, children, hideSeparator } = this.props
        const Container = !!toggleMenu ? Touchable : View

        return (
            <View style={[ styles.separator, { borderBottomWidth: hideSeparator ? 0 : 1 } ]}>
                <Container onPress={ toggleMenu }>
                    <View style={ styles.header }>
                    <Text bold size={14}
                        style={ styles.headerText }
                        color={this.props.color}>{ title }</Text>
                        <View style={{ flex: 1 }} />
                    { !!toggleMenu && (
                        <Icon name={ menuOpen ? closeIcon ? closeIcon : 'caret-up' : 'caret-down' } size={18}
                            style={{ marginRight: 10, textAlign: 'right' }}
                            color={ theme.secondaryTextColor } />
                    )}
                    </View>

                    { !!children && (
                        <Text secondary size={12} style={ styles.subHeaderText }>
                            { children }
                        </Text>
                    )}
                </Container>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerText: {
        marginBottom: 9,
        marginHorizontal: 10,
        marginTop: 10
    },
    separator: {
        borderBottomColor: theme.backgroundColor,
        borderBottomWidth: 1
    },
    subHeaderText: {
        marginBottom: 10,
        marginHorizontal: 10,
        marginTop: -8
    }
})


ListItemHeader.propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]),
    closeIcon: PropTypes.string,
    color: PropTypes.string,
    hideSeparator: PropTypes.bool,
    menuOpen: PropTypes.bool,
    title: PropTypes.string.isRequired,
    toggleMenu: PropTypes.func
}


export default connect(state => ({
    color: state.settings.color
}))(ListItemHeader)