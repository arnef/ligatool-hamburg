import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Text } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import { getColor } from '../../redux/modules/user';

function DrawerItemLeague(props) {
  const active =
    props.league.standing === 0
      ? `${Routes.LEAGUE_CUP}_${props.league.id}` === props.activeItem
      : `${Routes.LEAGUE}_${props.league.id}` === props.activeItem;

  return (
    <ListItem
      maxHeight={48}
      active={active}
      onPress={
        
        active
          ? () => {
              props.hideDrawer();
            }
          : () => {
              props.navigate(
                props.league.standing === 0 ? Routes.LEAGUE_CUP : Routes.LEAGUE,
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
    color: getColor(state),
  }),
  dispatch => ({
    hideDrawer: () => dispatch(NavigationActions.back()),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(DrawerItemLeague);
