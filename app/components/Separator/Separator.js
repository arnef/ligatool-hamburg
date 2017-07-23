// @flow
import React from 'react';
import { View } from 'react-native';

import styles from './styles';

type SeparatorProps = {
  image?: boolean,
  table?: boolean,
  full?: boolean,
  group?: boolean,
};

export default function Separator(props: SeparatorProps): ReactElement<any> {
  const style = [styles.separator];
  let marginLeft = 16;

  if (props.image) marginLeft += 48;
  if (props.table) marginLeft += 24;
  if (props.full) marginLeft = 0;
  if (props.group) {
    marginLeft = 0;
    style.push({ height: 12 });
  }
  style.push({ marginLeft });

  return (
    <View style={styles.container}>
      <View style={style} />
    </View>
  );
}
