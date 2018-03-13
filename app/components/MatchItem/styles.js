import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    alignItems: 'flex-start',
  },
  teams: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 12,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  teamName: {
    marginTop: 8,
    flex: 2,
  },
  score: {
    flex: 0,
    alignItems: 'center',
  },
});
