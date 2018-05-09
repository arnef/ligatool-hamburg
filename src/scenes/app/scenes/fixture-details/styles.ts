import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHalftime: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  containerToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  firstMatch: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  firstMatchResult: {
    alignItems: 'center',
    backgroundColor: '#909090',
    borderRadius: 6,
    padding: 6,
  },
  halftime: {
    marginHorizontal: 12,
    textAlign: 'center',
  },
  option: {
    flex: 1,
  },
  player: {
    flex: 1,
  },
  playerContainer: {
    alignItems: 'center',
    padding: 6,
  },
  playerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  playerText: {
    textAlign: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    backgroundColor: '#ccc',
    flex: 1,
    height: 1,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  teamVs: {
    fontSize: 24,
    textAlignVertical: 'center',
  },
  textFirstMatchResult: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
  },
});
