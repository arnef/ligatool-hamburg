// @flow
import { StyleSheet, Platform } from 'react-native';

const FONT_MONOSPACE = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export default StyleSheet.create({
  container: {
    elevation: 4,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowOffset: { height: StyleSheet.hairlineWidth },
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    // zIndex: 999,
  },
  containerTeam: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  containerScore: {
    justifyContent: 'center',
  },
  textTeam: {
    textAlign: 'center',
    fontWeight: Platform.OS === 'android' ? '600' : '400',
    color: '#fff',
  },
  textScore: {
    textAlign: 'center',
    fontFamily: FONT_MONOSPACE,
    fontWeight: '600',
    color: '#fff',
  },
});
