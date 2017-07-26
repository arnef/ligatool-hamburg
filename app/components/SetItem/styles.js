import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    padding: 12,
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerPlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  containerPlayer: {
    flexDirection: 'row',
    flex: 2,
    paddingHorizontal: 6,
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
