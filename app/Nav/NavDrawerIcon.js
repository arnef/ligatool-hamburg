import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Icon, Touchable } from '../components/base'
import { ANDROID } from '../consts'

export default (navigation, defaultHeader) => {
    if (Platform.OS === ANDROID) {
        return {
            ...defaultHeader,
            left: (
                <Touchable
                    borderless
                    pressColor='#fff'
                    delayPressIn={0}
                    onPress={() => navigation.navigate('DrawerOpen')}>
                    <Icon name='menu' style={styles.icon} color='#fff' size={24} />
                </Touchable>
            )
        }
    } else {
        return defaultHeader
    }
}

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
        margin: 16
    }
})