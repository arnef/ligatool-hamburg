import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerToggle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    alignItems: 'center',
  },
  containerHalftime: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 12,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  halftime: {
    marginHorizontal: 12,
    textAlign: 'center',
  },
});
