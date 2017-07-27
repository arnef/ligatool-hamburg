// @flow
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';

function DrawerItemLeague(props): ReactElement<any> {
  const active = props.league.cup
    ? `${Routes.LEAGUE_CUP}_${props.league.id}` === props.activeItem
    : `${Routes.LEAGUE}_${props.league.id}` === props.activeItem;

  return (
    <ListItem
      maxHeight={48}
      active={active}
      onPress={
        active
          ? null
          : () => {
              props.navigate(
                props.league.cup ? Routes.LEAGUE_CUP : Routes.LEAGUE,
                { title: props.league.name, id: props.league.id },
              );
            }
      }
    >
      <Text bold color={active ? props.color : null}>
        {props.league.name}
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
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(DrawerItemLeague);
