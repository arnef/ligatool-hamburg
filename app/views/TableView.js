import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import style from '../style';
import Touchable from '../components/Touchable';
import { ListItemGroup } from '../components/List';
import { Container, Image, Icon, Text } from '../components';
import styles from '../components/Styles/List/ListItem';
import { TEAM } from '../views/routes';
import { Row, Column } from '../ui';

class TableView extends Component {

  componentDidMount() {
    if (!this.props.league.id[this.props.leagueID]) {
      this._getLeagues();
    }
  }

  _renderTeam(data, idx, last) {
    let imgSize = 24;
    let textSize = {};
    const color = idx === -1 ? { color: this.props.color, fontWeight: 'normal' } : {};

    const childs = (
      <Row style={[styles.item, idx === -1 ? { height: 28, padding: 0 } : {}]}>
        <Column style={{minWidth: 0, marginLeft: 4}}>
          <Text style={[style.textBold, textSize]}>{data.position}</Text>
        </Column>
        <Column>
          {data.image && (<Image url={data.image} size={imgSize} />)}
          {!data.image && idx !== -1 && (<Icon name='shirt' size={imgSize + 8} style={{ height: imgSize }} />)}
        </Column>
        <Column style={{ flex: 3.5, alignItems: 'flex-start' }}>
          <Text style={[textSize, color]} numberOfLines={1} ellipsizeMode='tail'>{data.name}</Text>
        </Column>
        <Column center fluid style={{ minWidth: 30 }}>
          <Text style={[textSize, color]}>{data.matches}</Text>
        </Column>
        <Column center fluid style={{ minWidth: 30 }}>
          <Text style={[textSize, color]}>{data.set_points_diff}</Text>
        </Column>
        <Column center fluid style={{ minWidth: 30 }}>
          <Text style={[textSize, color]}>{data.goals_diff}</Text>
        </Column>
        <Column center fluid style={{ minWidth: 30 }}>
          <Text style={[textSize, color]} bold>{data.points}</Text>
        </Column>
      </Row>
    );
    if (idx > -1) {
      return (
        <View key={idx}>
          <Touchable  onPress={() => {
            this._onPress(data);
          }}>{childs}</Touchable>
          { !last && (<View style={styles.separator} />) }
        </View>
      );
    } else {
      return (<View key={idx}>{childs}<View style={styles.separator} /></View>);
    }
  }

  _onPress(team) {
    this.props.navigator.push({
      state: TEAM,
      team: team,
      title: team.name
    });
  }

  _getLeagues() {
    this.props.getLeague(this.props.leagueID);
  }

  render() {
    const table = !!this.props.league.id[this.props.leagueID] ? this.props.league.id[this.props.leagueID].table : [];
    return (
        <Container 
          { ...this.props }
          error={this.props.league.error}
          refreshing={this.props.league.loading}
          onRefresh={this._getLeagues.bind(this)}>
          { table.length > 0 && (
          <ListItemGroup>
            { !this.props.league.error && this._renderTeam(
            {
              position: '', team: '', matches: 'Sp.',
              set_points_diff: 'Sätze', goals_diff: 'Tore', points: 'Pkt.'
            }, -1
            )}
            {table.map((team, idx) => {
              return this._renderTeam(team, idx, idx === table.length-1);
            })}
          </ListItemGroup>) }
        </Container>
    );
  }
}

TableView.propTypes = {
  league: React.PropTypes.object,
  leagueID: React.PropTypes.number,
  color: React.PropTypes.string,
  navigator: React.PropTypes.object,
  getLeague: React.PropTypes.func
};

export default connect((state) => ({
  color: state.settings.color,
  league: state.league
}))(TableView);
