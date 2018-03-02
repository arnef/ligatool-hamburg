import React from 'react';
import { Text as RNText } from 'react-native';

import styles from './styles';

export default function Text(props) {
  const { color, secondary, bold, center, small, style, ...rest } = props;
  const textStyle = [styles.text];

  if (color) textStyle.push({ color });
  if (secondary) textStyle.push(styles.secondary);
  if (bold) textStyle.push(styles.bold);
  if (style) {
    if (styles instanceof Array) {
      styles.map(style => textStyle.push(style));
    } else {
      textStyle.push(style);
    }
  }
  if (center) textStyle.push(styles.center);
  if (small) textStyle.push(styles.small);

  const children =
    typeof props.children === 'number' ? `${props.children}` : props.children;

  return (
    <RNText {...rest} ellipsizeMode={'tail'} style={textStyle}>
      {children}
    </RNText>
  );
}
