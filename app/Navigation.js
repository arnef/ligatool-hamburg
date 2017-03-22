import React, { Component, PropTypes } from 'react'
import { NavigationExperimental, StyleSheet, Platform, Text, View } from 'react-native'
import { Touchable, Icon } from './components/base'
import * as theme from './components/base/theme'
import { connect } from 'react-redux'
import * as Views from './views'
import * as Routes from './views/routes'

const { CardStack, Header } = NavigationExperimental
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 24
const ICON_SIZE = Platform.OS === 'ios' ? 24 : 28

class Navigation extends Component {

    render() {
        const appNavigationState = this.props.route
        const { tabs } = appNavigationState
        const tabKey = tabs.routes[tabs.index].key
        const scenes = appNavigationState[tabKey]

        return (
            <CardStack navigationState={ scenes }
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

        return (
            <Header { ...sceneProps } 
                direction='horizontal'
                onNavigateBack={this.onNavigateBack.bind(this)}
                style={ [styles.appbar, { backgroundColor: color }] }
                renderTitleComponent={ this.renderTitle.bind(this) }
                renderLeftComponent={ this.renderLeftComponent.bind(this) }
                 />
        )
    }

    renderLeftComponent(sceneProps) {
        if (sceneProps.scene.index === 0 && Platform.OS === 'android') {
            return (
                <Touchable color borderless style={ styles.buttonContainer } 
                    onPress={ () => { if (this.props.drawer) { this.props.drawer.openDrawer() } } }>
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
                return <Views.Overview { ...this.props } />
            }

            case Routes.MY_TEAM: {
                return <Views.MyTeam { ...this.props } />
            }

            case Routes.LEAGUES: {
                return <Views.Leagues { ...this.props } />
            }

            case Routes.SETTINGS: {
                return <Views.Settings.SettingsView { ...this.props } />
            }

            // case Routes.LIVE_MATCH: {
            //     return <Views.LiveMatch { ...this.props } id={ route.id } />
            // }

            case Routes.MATCH: {
                return <Views.Match { ...this.props } />
            }

            case Routes.RANKING: {
                return <Views.LeagueView { ...this.props } leagueID={ route.leagueID } />
            }

            // case Routes.PREVIEW: {
            //     return <Views.PreviewMatch { ...this.props } home={ route.home } away={ route.away } />
            // }

            case Routes.TEAM: {
                return <Views.TeamOverview { ...this.props } team={ route.team } />
            }

            case Routes.SETTINGS_NOTIFICATION: {
                return <Views.Settings.SettingsNotificationView { ...this.props } />
            }
        }
    }
}

const styles = StyleSheet.create({
    appbar: {
        borderBottomWidth: 0,
        elevation: 0,
        height: APPBAR_HEIGHT + STATUSBAR_HEIGHT
    },
    button: {
        height: ICON_SIZE,
        margin: 10,
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
        fontSize: Platform.OS === 'ios' ? 18 : 22,
        fontWeight: '500',
        textAlign: Platform.OS === 'ios' ? 'left' : 'left'
    }
})

Navigation.propTypes = {
    drawer: PropTypes.object,
    popRoute: PropTypes.func,
    route: PropTypes.object,
    settings: PropTypes.object,
    showLogin: PropTypes.func
}

export default connect(state => ({
    ...state //TODO map only needed props
}))(Navigation)