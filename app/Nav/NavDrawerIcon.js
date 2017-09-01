import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Touchable } from '../components';
import Routes from '../config/routes';

export default (title = null) => ({ navigation }) => {
  const drawer =
    [
      Routes.OVERVIEW,
      Routes.MY_TEAM,
      Routes.LEAGUE,
      Routes.LEAGUE_CUP,
      Routes.SETTINGS,
    ].indexOf(navigation.state.routeName) !== -1;

  return {
    title:
      title || (navigation.state.params ? navigation.state.params.title : null),
    headerLeft: drawer
      ? <Touchable
          borderless
          style={styles.container}
          pressColor={'rgba(255, 255, 255, .8)'}
          onPress={() => navigation.navigate('DrawerOpen')}
        >
          <Icon name="menu" style={styles.icon} color="#fff" size={24} />
        </Touchable>
      : <Touchable
          borderless
          style={styles.container}
          pressColor={'rgba(255,255,255, .8)'}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" style={styles.icon} color="#fff" size={24} />
        </Touchable>,
  };
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
  },
  icon: {
    height: 24,
    width: 24,
    // margin: 16,
  },
});
