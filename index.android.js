import React, { Component } from 'react'
import { AppRegistry, Platform, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import AppContainer from './app/AppContainer'

import store from './app/store'
import { ANDROID_VERSION_LOLLIPOP } from './app/consts'

class androidapp extends Component {

    componentDidMount() {
        if (Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('rgba(0,0,0,.3)')
        }
    }

    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        )
    }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp)
