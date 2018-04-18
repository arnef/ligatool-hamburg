import React from 'react';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { ListItem, Text, Separator, Content } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import * as LeaguesActions from '../../redux/modules/leagues';
import Routes from '../../config/routes';
import { sortCompetition } from '../../Helper';

function LeaguesView(props) {
  return (
    <Content
      onRefresh={props.getLeagues}
      renderItem={({ item }) => (
        <ListItem
          onPress={() =>
            props.navigate(!item.standing ? Routes.LEAGUE_CUP : Routes.LEAGUE, {
              id: item.id,
              title: item.name,
            })
          }
        >
          <Text>{`${item.name}`}</Text>
        </ListItem>
      )}
      renderSeparator={Separator}
      data={props.leagues}
    />
  );
}

export default connect(
  state => ({
    leagues: sortBy(state.drawer, sortCompetition),
  }),
  dispatch => ({
    getLeagues: () => dispatch(LeaguesActions.getLeagues()),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(LeaguesView);
