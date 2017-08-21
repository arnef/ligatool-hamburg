import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    marginRight: Platform.OS === 'android' ? 16 : 8,
  },
  subHeader: {
    elevation: 4,
    height: 56,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 4,
    flex: 1,
  },
  searchInput: {
    minHeight: 22,
    flex: 1,
    padding: 0,
    margin: 0,
    color: colors.TEXT_PRIMARY,
  },
  clearIcon: {
    opacity: 0.6,
    color: colors.TEXT_SECONDARY,
  },
  iconContainer: {
    marginLeft: Platform.OS === 'android' ? 16 : 8,
  },
  loading: {
    marginRight: 2,
  },
  message: {
    padding: 16,
    alignItems: 'center',
  },
});
