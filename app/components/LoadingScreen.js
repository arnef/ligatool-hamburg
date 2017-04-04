import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native'


class LoadingScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0)
        }
    }

    componentDidMount() {
        this.animation()
    }

    animation() {
        Animated.sequence([
            Animated.timing(this.state.opacity, { duration: 700, toValue: 1 }),
            Animated.timing(this.state.opacity, { duration: 700, toValue: 0.3 })
        ]).start(event => {
            if (event.finished) {
                this.animation()
            }
        })
    }

    render() {

        return (
            <View style={style.container}>
                <Animated.Image source={{ uri: 'loading' }} style={[style.icon, { opacity: this.state.opacity }]} />
            </View>
        )
    }

}

const style = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    icon: {
        height: 64,
        width: 64
    }
})

export default LoadingScreen
