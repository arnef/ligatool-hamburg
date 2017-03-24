import React, { Component, PropTypes } from 'react'
import { DrawerLayoutAndroid, BackAndroid, Dimensions, Platform, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { resetToRoute, popRoute, pushRoute } from './store/actions/routeActions'
import LoginModal from './modals/LoginModal'
import LoadingModal from './modals/LoadingModal'
import { Drawer } from './views'
import * as Route from './views/routes'
import Navigation from './Navigation'
import * as theme from './components/base/theme'

const windowWidth = Math.floor(Dimensions.get('window').width * 0.8)
const drawerWidth = windowWidth < 300 ? windowWidth : 300

class App extends Component {

    _onNavigate(action) {
        if (this.drawer) {
            this.drawer.closeDrawer()
        }
        this.props.resetToRoute(action)
    }

    _openDrawer() {
        if (this.drawer) {
            this.drawer.openDrawer()
        }
    }


    componentDidMount() {
        if (Platform.Version > 20) {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('rgba(0,0,0,.3)')
        }

        BackAndroid.addEventListener('hardwareBackPress', () => {
            const { route, popRoute, resetToRoute } = this.props
            const tabKey = route.tabs.routes[0].key
            const index = route[tabKey].index

            if (this.drawer && this.isOpen) {
                this.drawer.closeDrawer()
            }
            else if (index > 0) {
                popRoute()
            }
            else if (index === 0 && route[tabKey].routes[0].state !== Route.OVERVIEW) {
                resetToRoute({ state: Route.OVERVIEW, title: 'Übersicht' })
            } else {
                BackAndroid.exitApp()
            }

            return true
        })

    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress')
    }


    render() {
        return (
            <DrawerLayoutAndroid
                style={{ backgroundColor: theme.backgroundColor }}
                drawerWidth={drawerWidth}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={drawer => { this.drawer = drawer }}
                onDrawerOpen={() => { this.isOpen = true }}
                onDrawerClose={() => { this.isOpen = false }}
                renderNavigationView={() => (
                    <Drawer {...this.props}
                        onNavigate={this._onNavigate.bind(this)}
                        width={drawerWidth} />)
                }>
                    <LoginModal />
                    <LoadingModal />
                    <Navigation
                        topBorder={ Platform.Version > 20 }
                        initialRoute={{ state: Route.OVERVIEW, title: 'Übersicht' }}
                        drawer={this.drawer} />
            </DrawerLayoutAndroid>
        )
    }
}

App.propTypes = {
    popRoute: PropTypes.func,
    pushRoute: PropTypes.func,
    resetToRoute: PropTypes.func,
    route: PropTypes.object
}

export default connect(
    state => ({
        route: state.route
    }),
    dispatch => ({
        popRoute: () => dispatch(popRoute()),
        pushRoute: (route) => dispatch(pushRoute(route)),
        resetToRoute: (route) => dispatch(resetToRoute(route))
    })
)(App)
