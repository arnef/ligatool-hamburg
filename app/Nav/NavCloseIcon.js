import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Icon, Touchable } from '../components';
import * as NavigationActions from '../redux/modules/navigation';

export default (title, action) => ({ navigation }) => ({
  title: title || navigation.state.params.title,
  headerLeft: (
    <Touchable
      borderless
      pressColor={'rgba(255, 255, 255, .8)'}
      style={styles.container}
      onPress={() => {
        navigation.dispatch(action || NavigationActions.hideLogin());
      }}
    >
      <Icon name="close" color="#fff" style={styles.icon} size={iconSize} />
    </Touchable>
  ),
});

const iconSize = Platform.OS === 'android' ? 24 : 20;
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 16 : 12,
  },
  icon: {
    height: iconSize,
    width: iconSize,
  },
});
