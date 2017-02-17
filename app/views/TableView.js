import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import style from '../style';
import Touchable from '../components/Touchable';
import { ListItem, ListItemGroup } from '../components/List';
import { Container, Image, Icon, Text } from '../components';
import { TEAM } from '../views/routes';

class TableView extends Component {

  componentDidMount() {
    if (!this.props.league.id[this.props.leagueID]) {
      this._getLeagues();
    }
  }

  _renderTeam(data, idx) {
    let imgSize = 40;
    let textSize={};
    const color = idx === -1 ? { color: this.props.color, fontWeight: 'bold'} : {};

    const childs = (<View style={[style.row, s.teamRow, idx === -1 ? {height: 28, backgroundColor: '#fff'}: {} ]}>
          <Text style={[style.textBold, textSize, {paddingLeft: 16, paddingRight: 8, width: 40}]}>{data.position} </Text>
        <View style={s.column}>
        { data.image && (<Image url={data.image} size={imgSize} />)}
        { !data.image && idx !== -1 && (<Icon name='shirt' size={imgSize+8} style={{height: imgSize}} />)}
        </View>
        <View style={[s.column, {flex: 3.5, alignItems: 'flex-start'}]}>
        <Text style={[textSize, color]}>{data.name}</Text>
        </View>
        <View style={[s.column, {minWidth: 30}]}>
        <Text style={[textSize, color]}>{data.matches}</Text></View>
        <View style={s.column}>
        <Text style={[textSize, color]}>{data.set_points_diff}</Text></View>
        <View style={s.column}>
        <Text style={[textSize, color]}>{data.goals_diff}</Text></View>
        <View style={s.column}>
        <Text style={[textSize, color, style.textBold]}>{data.points}</Text></View>
      </View>);
    if (idx > -1) {
      return (<View key={idx}>
        <Touchable  onPress={() => {
          this._onPress(data);
        }}>{ childs }</Touchable>
        <ListItem.Separator /></View>
      );
    } else {
      return (<View key={idx}>{childs}<ListItem.Separator /></View>);
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
      
      <View style={s.container}>
      { table.length > 0 && !this.props.league.error && this._renderTeam(
        { position: '', team: '', matches: 'Sp.',
          set_points_diff: 'Sätze', goals_diff: 'Tore', points: 'Pkt.'}, -1
      )}
      <Container error={this.props.league.error}
          refreshing={this.props.league.loading}
          onRefresh={this._getLeagues.bind(this)}>
          <ListItemGroup>
            { table.map((team, idx) => {
              return this._renderTeam(team, idx);
            }) }
        </ListItemGroup>

      </Container>
        
      </View>
    );
  }
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  teamRow: {
    height: 56,
    alignItems: 'center'
  },
  column: {
    minWidth: 46,
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 8,
    paddingBottom: 8
  }
});

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
