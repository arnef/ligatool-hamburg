import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { CardStack } from 'react-navigation'

class NavHeader extends Component {

    render() {
        const { style, ...rest } = this.props
        const headerStyle = [ style ]

        headerStyle.push({
            backgroundColor: this.props.color
        })

        return (<CardStack.Header
            { ...rest }
            style={ headerStyle } />
        )
    }
}

NavHeader.propTypes = {
    color: PropTypes.string,
    style: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ])
}

export default {
    headerComponent: connect(
        state => ({ color: state.settings.color })
    )(NavHeader),
    navigationOptions: {
        header: {
            backTitle: null,
            tintColor: '#fff'
        }
    }
}
