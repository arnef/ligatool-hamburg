import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 9,
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerPlayers: {
    flex: 2,
    justifyContent: 'space-around',
  },
  containerPlayer: {
    flexDirection: 'row',
    flex: 2,
    marginVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  textPlayer: {
    flex: 1,
  },
  textTitle: {
    flex: 1,
  },
  iconTitle: {
    color: colors.TEXT_SECONDARY,
  },
});
