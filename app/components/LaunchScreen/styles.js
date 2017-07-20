import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
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
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  textBig: {
    fontSize: 16,
  },
  icon: {
    height: 64,
    width: 64,
  },
});
