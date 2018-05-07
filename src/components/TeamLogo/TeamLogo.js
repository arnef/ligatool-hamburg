import React from 'react';
import { Icon } from '../Icon';
import { Image } from '../Image';

import styles from './styles';

const iconSize = 32;
const bigIconSize = 42;

export default function TeamLogo(props) {
  if (props.team) {
    return (
      <Image
        style={[
          styles.image,
          props.left ? { marginHorizontal: 0, marginRight: 16 } : {},
        ]}
        size={props.size || (props.big ? bigIconSize : iconSize)}
        url={props.team}
      />
    );
  } else {
    return (
      <Icon
        size={props.size || (props.big ? bigIconSize : iconSize)}
        name={'shirt'}
        style={[
          styles.icon,
          props.left ? { marginHorizontal: 0, marginRight: 16 } : {},
        ]}
      />
    );
  }
}
