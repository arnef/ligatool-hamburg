// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { darken } from '../../Helper';

import styles from './styles';

type StaticListHeaderProps = {
  children: Array<ReactElement<any>>,
  style: number | Object,
  color: string,
};

function StaticListHeader(props: StaticListHeaderProps): ReactElement<any> {
  const headerStyle = [styles.row, { backgroundColor: darken(props.color, 5) }];

  if (props.style) {
    headerStyle.push(props.style);
  }

  return (
    <View style={headerStyle}>
      {props.children}
    </View>
  );
}

export default connect(state => ({ color: state.settings.color }))(
  StaticListHeader,
);
