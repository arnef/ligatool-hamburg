import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Icon, Touchable } from '../components/base';
import { ANDROID } from '../consts';

// export default (navigation, defaultHeader) => {
//
//   if (Platform.OS === ANDROID) {
//     return {
//       ...defaultHeader,
//       left: (
//         <Touchable borderless onPress={() => navigation.navigate('DrawerOpen')}>
//           <Icon name="menu" style={styles.icon} color="#fff" size={24} />
//         </Touchable>
//       ),
//     };
//   } else {
//     return defaultHeader;
//   }
// };

export default (title=null) => ({ navigation}) => {
  return {
    title: title || navigation.state.params.title,
    headerLeft: (
      <Touchable borderless onPress={() => navigation.navigate('DrawerOpen')}>
          <Icon name="menu" style={styles.icon} color="#fff" size={24} />
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    margin: 16,
  },
});
