import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
import { ANDROID } from '../consts';

class LaunchScreen extends Component {
  render() {
    return (
      <View style={style.container}>
        <Image source={{ uri: 'loading' }} style={style.icon} />
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
    justifyContent: 'center',
  },
  text: {
    color: '#888',
    fontSize: 14,
    fontFamily: Platform.OS === ANDROID ? 'monospace' : 'Courier New',
  },
  textBig: {
    fontSize: 16,
  },
  icon: {
    height: 64,
    width: 64,
  },
});

export default LaunchScreen;
