import React, { Component, PropTypes } from 'react'
import { NavigationExperimental, StyleSheet, Platform, Text, View } from 'react-native'
import { Touchable, Icon } from './components/base'
import * as theme from './components/base/theme'
import { connect } from 'react-redux'
import * as actions from './store/actions/routeActions'
import * as Views from './views'
import * as Routes from './views/routes'

const { CardStack, Header } = NavigationExperimental
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 24
const ICON_SIZE = 24 //Platform.OS === 'ios' ? 24 : 28

class Navigation extends Component {

    render() {
        const appNavigationState = this.props.route
        const { tabs } = appNavigationState
        const tabKey = tabs.routes[tabs.index].key
        const scenes = appNavigationState[tabKey]

        return (
            <CardStack navigationState={ scenes }
                direction={ Platform.OS === 'android' ? 'vertical' : 'horizontal' }
                style={{ backgroundColor: theme.backgroundColor, flex: 1 }}
                onNavigateBack={ this.onNavigateBack.bind(this) }
                renderHeader={ this.renderHeader.bind(this) }
                renderScene={ this.renderScene.bind(this) }
             />
        )
    }

    onNavigateBack() {
        this.props.popRoute()
    }

    renderHeader(sceneProps) {
        const { color } = this.props.settings
        const route = sceneProps.scene.route
        const appbarStyle = [styles.appbar]

        appbarStyle.push({ backgroundColor: color })
        if (route.state === Routes.LEAGUES
            || route.state === Routes.SETTINGS
            || route.state === Routes.SETTINGS_NOTIFICATION
            || route.state === Routes.LEAGUE_MATCHES) {
            appbarStyle.push({
                elevation: 4,
                shadowOffset: { height :  StyleSheet.hairlineWidth },
                shadowRadius: StyleSheet.hairlineWidth
            })
        }

        return (
            <Header { ...sceneProps }
                direction='horizontal'
                onNavigateBack={this.onNavigateBack.bind(this)}
                style={ appbarStyle }
                renderTitleComponent={ this.renderTitle.bind(this) }
                renderLeftComponent={ this.renderLeftComponent.bind(this) }
                 />
        )
    }

    renderLeftComponent(sceneProps) {
        if (sceneProps.scene.index === 0 && Platform.OS === 'android') {
            return (
                <Touchable color borderless style={ styles.buttonContainer }
                    onPress={ () =>  this.props.openDrawer() }>
                    <Icon style={ styles.button } size={ICON_SIZE} color='#fff' name='menu' />
                </Touchable>
            )
        }
        else if (sceneProps.scene.index > 0) {
            return (
                <Touchable color borderless style={styles.buttonContainer} onPress={ this.onNavigateBack.bind(this) }>
                    <Icon style={styles.button} size={ICON_SIZE} color='#fff' name='arrow-back' />
                </Touchable>
            )
        }
    }

    renderTitle(props) {
        return (
            <View style={ styles.title }>
                <Text style={ styles.titleText } numberOfLines={1} ellipsizeMode='tail'>
                    { props.scene.route.title }
                </Text>
            </View>
        )
    }

    renderScene(sceneProps) {
        const route = sceneProps.scene.route

        switch(route.state) {
            // App routes
        case Routes.OVERVIEW: {
            return <Views.Overview />
        }

        case Routes.MY_TEAM: {
            return <Views.MyTeam />
        }

        case Routes.LEAGUES: {
            return <Views.Leagues />
        }

        case Routes.LEAGUE_MATCHES: {
            return <Views.LeagueMatchesView leagueID={ route.leagueID } />
        }

        case Routes.SETTINGS: {
            return <Views.Settings.SettingsView />
        }

        case Routes.MATCH: {
            return <Views.Match id={ route.id } />
        }

        case Routes.RANKING: {
            return <Views.LeagueView leagueID={ route.leagueID } />
        }

        case Routes.TEAM: {
            return <Views.TeamOverview team={ route.team } />
        }

        case Routes.SETTINGS_NOTIFICATION: {
            return <Views.Settings.SettingsNotificationView />
        }
        }
    }
}

const styles = StyleSheet.create({
    appbar: {
        // borderBottomColor: 'rgba(0, 0, 0, .15)',
        borderBottomWidth: 0,
        elevation: 0,
        height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: .1,
        shadowRadius: 0,
        zIndex: 99
    },
    button: {
        height: ICON_SIZE,
        marginHorizontal: 12,
        marginVertical: 10,
        width: 24
    },
    buttonContainer: {
        alignItems: 'center',
        borderWidth: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 0 : STATUSBAR_HEIGHT
    },
    title:  {
        alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
        borderWidth: 0,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: Platform.OS === 'ios' ? 16 : 0,
        marginTop: Platform.OS === 'ios' ? 0 : STATUSBAR_HEIGHT
    },
    titleText: {
        color: '#fff',
        fontSize: Platform.OS === 'ios' ? 18 : 20,
        fontWeight: '500',
        textAlign: Platform.OS === 'ios' ? 'left' : 'left'
    }
})

Navigation.propTypes = {
    openDrawer: PropTypes.func,
    popRoute: PropTypes.func,
    route: PropTypes.object,
    settings: PropTypes.object,
    showLogin: PropTypes.func
}

export default connect(
    state => ({
        route: state.route,
        settings: state.settings
    }),
    dispatch => ({
        popRoute: () => dispatch(actions.popRoute())
    })
)(Navigation)