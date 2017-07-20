import { StyleSheet } from 'react-native';

import { colors } from '../../config/styles';

export default StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.TEXT_PRIMARY,
  },
  secondary: {
    color: colors.TEXT_SECONDARY,
  },
  bold: {
    fontWeight: 'bold',
  },
  center: {
    textAlign: 'center',
  },
  small: {
    fontSize: 12,
  },
});
