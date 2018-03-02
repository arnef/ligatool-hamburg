import { StyleSheet, Platform } from 'react-native';

const FONT_MONOSPACE = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export default StyleSheet.create({
  container: {
    elevation: 4,
    flexDirection: 'row',
    height: 48,
    // justifyContent: 'space-around',
    // borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    // borderBottomColor: 'rgba(0,0,0,.3)',
    // shadowColor: 'black',
    // shadowOffset: { height: StyleSheet.hairlineWidth },
    // shadowOpacity: 0.1,
    // shadowRadius: StyleSheet.hairlineWidth,
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
