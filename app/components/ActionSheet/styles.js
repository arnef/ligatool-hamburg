import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  outside: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    marginTop: Math.round(Dimensions.get('window').height * 0.25),
  },
});
