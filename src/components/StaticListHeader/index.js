import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { darken } from '../../helper';

import styles from './styles';
import { getColor } from '../../redux/modules/user';

function StaticListHeader(props) {
  const headerStyle = [
    styles.row,
    { backgroundColor: darken(props.color, 0.05) },
  ];

  if (props.style) {
    headerStyle.push(props.style);
  }

  return <View style={headerStyle}>{props.children}</View>;
}

export default connect(state => ({ color: getColor(state) }))(StaticListHeader);
