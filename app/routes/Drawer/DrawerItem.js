// @flow
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';

import { colors } from '../../config/styles';

type DrawerItemProps = {
  name: string,
  routeName: string,
  activeItem: string,
  icon: string,
  color: string,
  navigate: Function,
};

function DrawerItem(props: DrawerItemProps): ReactElement<any> {
  const active = props.routeName === props.activeItem;
  const color = active ? props.color : colors.TEXT_SECONDARY;
  return (
    <ListItem
      maxHeight={48}
      active={active}
      onPress={active ? null : () => props.navigate(props.routeName)}
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
    color: state.settings.color,
  }),
  (dispatch: Dispatch<any>) => ({
    navigate: routeName => dispatch(NavigationActions.navigate({ routeName })),
  }),
)(DrawerItem);
