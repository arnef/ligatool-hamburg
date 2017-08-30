// @flow
import React from 'react';
import Icon from '../Icon';
import Image from '../Image';

import styles from './styles';

type TeamLogoProps = {
  team: { image?: string },
  big?: boolean,
};

const iconSize = 32;
const bigIconSize = 42;

export default function TeamLogo(props: TeamLogoProps): ReactElement<any> {
  if (props.team.image) {
    return (
      <Image
        style={[
          styles.image,
          props.left ? { marginHorizontal: 0, marginRight: 16 } : {},
        ]}
        size={props.size || (props.big ? bigIconSize : iconSize)}
        url={props.team.image}
      />
    );
  } else {
    return (
      <Icon
        size={props.size || (props.big ? bigIconSize : iconSize)}
        name={'shirt'}
        style={styles.icon}
      />
    );
  }
}
