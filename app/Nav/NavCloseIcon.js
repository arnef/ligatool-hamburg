import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Icon, Touchable } from '../components/base';
import * as NavigationActions from '../redux/modules/navigation';
import { ANDROID } from '../consts';

export default (title, action) => ({ navigation }) => ({
  title: title || navigation.state.params.title,
  headerLeft: (
    <Touchable
      borderless
      delayPressIn={0}
      onPress={() => {
        navigation.dispatch(action || NavigationActions.hideLogin());
        // navigation.dispatch(NavigationActions.hidePlayer());
      }}
    >
      <Icon name="close" color="#fff" style={styles.icon} size={iconSize} />
    </Touchable>
  ),
});

const iconSize = Platform.OS === ANDROID ? 24 : 20;
const styles = StyleSheet.create({
  icon: {
    height: iconSize,
    width: iconSize,
    margin: Platform.OS === ANDROID ? 16 : 12,
  },
});
