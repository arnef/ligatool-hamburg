import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 10,
  },
  wins: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(136, 168, 37, .7)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  draws: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(237, 140, 42, .7)',
  },
  lost: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(207, 74, 48, .7)',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
