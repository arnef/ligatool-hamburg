// @flow
import React from 'react';
import { Text as RNText } from 'react-native';

import styles from './styles';

type TextProps = {
  children: string,
  color?: string,
  size?: number,
  secondary?: boolean,
  bold?: boolean,
  center?: boolean,
  small?: boolean,
  style?: number | Array<number | Object> | Object,
} & RNText;

export default function Text(props: TextProps): ReactElement<any> {
  const { color, size, secondary, bold, center, small, style, ...rest } = props;
  const textStyle = [styles.text];

  if (color) textStyle.push({ color });
  if (secondary) textStyle.push(styles.secondary);
  if (bold) textStyle.push(styles.bold);
  if (size) {
    // textStyle.push({ fontSize: size });
    console.warn('Text props size is deprecated');
  }
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
