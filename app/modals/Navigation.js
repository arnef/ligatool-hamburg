import React, { Component, PropTypes } from 'react'
import { Navigator, Platform, StyleSheet, View as V } from 'react-native'
import { connect } from 'react-redux'
import { Row, Text, Icon, Touchable } from '../components/base'


class Navigation extends Component {


    render() {
        return (
            <Navigator
                style={{ flexDirection: 'column-reverse' }}
                ref={(navigator) => { this.navigator = navigator }}
                initialRoute={this.props.initialRoute}
                renderScene={this.renderSceneProps.bind(this)}
                navigationBar={
                    <Navigator.NavigationBar routeMapper={{
                        LeftButton: this.renderLeftButton.bind(this),
                        RightButton: () => {},
                        Title: this.renderTitle.bind(this)
                    }}
                    style={[styles.toolbar, {
                        backgroundColor: this.props.settings.color,
                        position: 'relative' }]} />
                }
            />
        )
    }

    renderSceneProps(route) {
        return this.props.renderScene(route, this)
    }

    resetTo(route) {
        this.setState({ title: null })
        this.navigator.resetTo(route)
    }


    push(route) {
        this.navigator.push(route)
    }


    pop() {
        this.navigator.pop()
    }

    getCurrentRoutes() {
        if (this.navigator) {
            return this.navigator.getCurrentRoutes()
        }

        return []
    }

    setTitle(title) {
        if (this.navigator && this.navigator.getCurrentRoutes) {
            const stack = this.navigator.getCurrentRoutes()

            if (stack.length > 0) {
                stack[stack.length - 1].title = title
                this.forceUpdate()
            }
        }
    }

    renderLeftButton(route, navigator, index) {
        if (index > 0) {
            return (
                <Touchable color borderless onPress={this.pop.bind(this)}>
                    <V style={styles.leftButton}>
                    <Icon size={24} color='#fff' name='arrow-back' />
                    </V>
                </Touchable>
            )
        } else if (index === 0 && this.props.closeModal) {
            return (
                <Touchable color borderless onPress={this.props.closeModal}>
                    <V style={styles.leftButton}>
                    <Icon size={24} color='#fff' name='close' />
                    </V>
                </Touchable>
            )
        }
    }

    renderTitle(route) {
        return (
            <Row style={styles.title}>
                <Text color='#fff' bold size={Platform.OS === 'ios' ? 17 : 20} numberOfLines={1} ellipsizeMode='tail'>{ route.title }</Text>
            </Row>
        )
    }
}

const styles = StyleSheet.create({
    leftButton: Platform.select({
        android: { padding: 16 },
        ios: { padding: 10 }
    }),
    title: Platform.select({
        android: { marginTop: 17 },
        ios: { marginTop: 12 }
    }),
    toolbar: Platform.select({
        android: { height: 56 },
        ios: {}
    })
})

Navigation.propTypes = {
    closeModal: PropTypes.func,
    initialRoute: PropTypes.object,
    renderScene: PropTypes.func,
    settings: PropTypes.object
}


export default connect(state => ({
    ...state
}))(Navigation)