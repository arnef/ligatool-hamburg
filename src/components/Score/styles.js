import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  score: {
    backgroundColor: '#555',
    borderRadius: 2,
    marginHorizontal: 4,
    padding: 6,
    width: 60,
  },
  scoreText: {
    color: '#FFF',
    fontFamily: Platform.select({
      android: 'monospace',
      ios: 'Courier New',
    }),
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
