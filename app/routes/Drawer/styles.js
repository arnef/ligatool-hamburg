import { StyleSheet, Dimensions } from 'react-native';

export const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;
const IMAGE_HEIGHT = Math.floor(DRAWER_WIDTH * 0.625);

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    overflow: 'hidden',
    width: DRAWER_WIDTH,
    height: IMAGE_HEIGHT,
  },
  image: {
    width: DRAWER_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  teamContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    position: 'absolute',
    width: DRAWER_WIDTH,
    top: IMAGE_HEIGHT - 66,
  },
  teamLogo: {
    height: 60,
    width: 60,
    marginLeft: 8,
  },
  teamName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 24,
    color: '#fff',
  },
});
