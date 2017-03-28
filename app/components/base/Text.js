import React, { Component, PropTypes } from 'react'
import { Text as RNText, StyleSheet } from 'react-native'
import * as theme from './theme'

class Text extends Component {

    render() {
        const textStyle = [styles.text]

        if (this.props.color) {
            textStyle.push({ color: this.props.color })
        }
        if (this.props.secondary) {
            textStyle.push({ color: theme.secondaryTextColor })
        }
        if (this.props.bold) {
            textStyle.push({ fontWeight: 'bold' })
        }
        if (this.props.size) {
            textStyle.push({ fontSize: this.props.size })
        }
        if (this.props.center) {
            textStyle.push({ textAlign: 'center' })
        }
        if (this.props.style) {
            textStyle.push(this.props.style)
        }

        return(
            <RNText { ...this.props} style={textStyle}>
                { this.props.upperCase ? this.props.children.toUpperCase() : this.props.children }
            </RNText>
        )
    }
}

Text.propTypes = {
    bold: PropTypes.bool,
    center: PropTypes.bool,
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]),
    color: PropTypes.string,
    secondary: PropTypes.bool,
    size: PropTypes.number,
    style: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
    upperCase: PropTypes.bool
}

const styles = StyleSheet.create({
    text: {
        borderWidth: 0,
        color: theme.primaryTextColor
    }
})

export default Text