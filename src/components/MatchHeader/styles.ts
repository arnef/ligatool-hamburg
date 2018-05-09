import { Platform, StyleSheet } from 'react-native';

const FONT_MONOSPACE = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export default StyleSheet.create({
  container: {
    elevation: 4,
    flexDirection: 'row',
    height: 48,
  },
  containerScore: {
    justifyContent: 'center',
  },
  containerTeam: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  textScore: {
    color: '#fff',
    fontFamily: FONT_MONOSPACE,
    fontWeight: '600',
    textAlign: 'center',
  },
  textTeam: {
    color: '#fff',
    fontWeight: Platform.OS === 'android' ? '600' : '400',
    textAlign: 'center',
  },
});
