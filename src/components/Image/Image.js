import React from 'react';
import { Image as RNImage } from 'react-native';

import styles from './styles';

export default function Image(props) {
  const source = props.url ? { uri: props.url } : props.source;

  const imgStyle = [styles.image];
  if (props.size) {
    imgStyle.push({ height: props.size, width: props.size });
  }
  if (props.width && props.height) {
    imgStyle.push({ height: props.height, width: props.width });
  }
  if (props.style) {
    if (props.style instanceof Array) {
      props.style.map(style => imgStyle.push(style));
    } else {
      imgStyle.push(props.style);
    }
  }

  return <RNImage source={source} style={imgStyle} />;
}
