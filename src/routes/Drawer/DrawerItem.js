import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';

import { colors } from '../../config/styles';
import { getColor } from '../../redux/modules/user';

function DrawerItem(props) {
  const active = props.routeName === props.activeItem;
  const color = active ? props.color : colors.TEXT_SECONDARY;
  return (
    <ListItem
      active={active}
      onPress={
        active ? props.hideDrawer : () => props.navigate(props.routeName)
      }
    >
      <ListItem.Icon name={props.icon} color={color} />
      <Text bold color={active ? color : null}>
        {props.name}
      </Text>
    </ListItem>
  );
}

export default connect(
  state => ({
    activeItem: state.nav.activeItem,
    color: getColor(state),
  }),
  dispatch => ({
    hideDrawer: () => dispatch(NavigationActions.back()),
    navigate: routeName => dispatch(NavigationActions.navigate({ routeName })),
  }),
)(DrawerItem);
