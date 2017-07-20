// @flow
import React from 'react';
import { Platform } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import styles from './styles';

type IconProps = {
  name: string,
  size: number,
  color?: string,
};

export default function Icon(props: IconProps): ReactElement<any> {
  let iconName =
    Platform.OS === 'android' ? `md-${props.name}` : `ios-${props.name}`;

  if (props.name === 'caret-forward') iconName = 'ios-arrow-forward-outline';
  else if (props.name === 'close') iconName = 'md-close';

  const iconStyle = [styles.icon, { height: props.size, width: props.size }];
  if (props.style) {
    iconStyle.push(props.style);
  }
  return (
    <IonIcon
      name={iconName}
      style={iconStyle}
      size={props.size}
      color={props.color}
    />
  );
}
