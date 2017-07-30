import { StyleSheet, Platform } from 'react-native';
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  option: {
    flex: 1,
  },
  teamVs: {
    fontSize: 24,
    textAlignVertical: 'center',
  },
  firstMatch: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  firstMatchResult: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: colors.TEXT_SECONDARY,
  },
  textFirstMatchResult: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  playerRow: {
    flexDirection: 'row',
    flex: 1,
  },
  player: {
    flex: 1,
  },
  playerContainer: {
    alignItems: 'center',
    padding: 6,
  },
  playerText: {
    textAlign: 'center',
  },
});
