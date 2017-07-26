import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    borderTopColor: colors.BACKGROUND,
    borderTopWidth: 1,
    paddingBottom: 0,
    marginTop: 12,
  },
  containerSet: {
    padding: 12,
  },
  containerPlayers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerPlayer: {
    alignItems: 'center',
    flex: 1,
  },
  containerScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonDisabled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    opacity: 0.5,
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    color: colors.TEXT_SECONDARY,
  },
  buttonText: {
    color: colors.TEXT_SECONDARY,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: Platform.select({
    android: {
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 24,
      padding: 6,
      textAlign: 'center',
    },
    ios: {
      color: '#fff',
      fontFamily: 'Courier New',
      fontSize: 24,
      fontWeight: 'bold',
      height: 30,
      margin: 8,
      textAlign: 'center',
    },
  }),
  score: {
    backgroundColor: '#666',
    borderRadius: 3,
    margin: 16,
    marginBottom: 0,
    marginTop: 10,
    width: 60,
  },
  vSeparator: {
    borderLeftColor: colors.BACKGROUND,
    borderLeftWidth: 1,
    borderRightColor: colors.BACKGROUND,
    borderRightWidth: 1,
    flex: 1,
  },
});
