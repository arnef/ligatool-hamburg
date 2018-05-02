import React from 'react';
import { View, Image, Text } from 'react-native';

import styles from './styles';

export default function LaunchScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'loading' }} style={styles.icon} />
      <View style={{ position: 'absolute', bottom: 32 }}>
        <Text style={[styles.text]}>
          powered by&nbsp;
          <Text style={[styles.text, styles.textBig]}>Arne Feil</Text>
        </Text>
      </View>
    </View>
  );
}
