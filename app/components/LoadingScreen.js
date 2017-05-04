import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text, Platform } from 'react-native';
import { ANDROID } from '../consts';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.animation();
  }

  animation() {
    Animated.sequence([
      Animated.timing(this.state.opacity, { duration: 700, toValue: 1 }),
      Animated.timing(this.state.opacity, { duration: 700, toValue: 0.3 })
    ]).start(event => {
      if (event.finished) {
        this.animation();
      }
    });
  }

  render() {
    return (
      <View style={style.container}>
        <Animated.Image
          source={{ uri: 'loading' }}
          style={[style.icon, { opacity: this.state.opacity }]}
        />
        <View style={{ position: 'absolute', bottom: 32 }}>
          <Text style={[style.text]}>
            powered by&nbsp;
            <Text style={[style.text, style.textBig]}>Arne Feil</Text>
          </Text>
        </View>
      </View>
    );
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
  text: {
    color: '#888',
    fontSize: 14,
    fontFamily: Platform.OS === ANDROID ? 'monospace' : 'Courier New'
  },
  textBig: {
    fontSize: 16
  },
  icon: {
    height: 64,
    width: 64
  }
});

export default LoadingScreen;
