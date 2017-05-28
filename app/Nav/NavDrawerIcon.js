import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Touchable } from '../components/base';

export default (title = null) => ({ navigation }) => {
  return {
    title: title || navigation.state.params.title,
    headerLeft: (
      <Touchable borderless onPress={() => navigation.navigate('DrawerOpen')}>
        <Icon name="menu" style={styles.icon} color="#fff" size={24} />
      </Touchable>
    ),
  };
};

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    margin: 16,
  },
});
