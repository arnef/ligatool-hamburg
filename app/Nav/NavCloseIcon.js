import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Icon, Touchable } from '../components/base'
import { showLogin } from '../store/actions/login'
import { ANDROID } from '../consts'

export default (navigation, defaultHeader) => {
    return {
        ...defaultHeader,
        left: (
            <Touchable
                borderless
                delayPressIn={0}
                onPress={() => navigation.dispatch(showLogin(false)) }>
                <Icon name='close' color='#fff' style={styles.icon} size={iconSize} />
            </Touchable>
        )
    }
}

const iconSize = Platform.OS === ANDROID ? 24 : 20
const styles = StyleSheet.create({
    icon: {
        height: iconSize,
        width: iconSize,
        margin: Platform.OS === ANDROID ? 16 : 12
    }
})