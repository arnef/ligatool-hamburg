import React, { Component } from 'react';
import { View } from 'react-native';
import Score from '../Score';
import ScoreInput from './ScoreInput';
import {
  Row,
  Column,
  ListItem,
  Touchable,
  Text,
  Image
} from '../../components/base';

class ListItemSet extends Component {
  render() {
    const data = this.props.data;
    const Container = this.props.editable ? Touchable : View;

    return (
      <ListItem.Group>
        <ListItem.Header
          title={data.name}
          toggleMenu={this.props.toggleMenu}
          closeIcon={this.props.scoreInput ? 'close' : 'caret-up'}
          menuOpen={this.props.menuOpen || this.props.scoreInput}
        />
        {!this.props.menuOpen &&
          !this.props.scoreInput &&
          <Container
            onPress={
              this.props.onPress
                ? () => {
                    this.props.onPress(data);
                  }
                : null
            }
          >
            <View style={{ marginTop: 8 }}>
              {data.sets.map((set, idx) => {
                return this.renderRow(set, idx);
              })}
            </View>
          </Container>}
        {this.props.menuOpen && this.renderOptions()}
        {this.props.scoreInput &&
          <ScoreInput
            data={data}
            adjustPosition={this.props.adjustPosition}
            onSave={this.props.onSave}
            toggleMenu={this.props.toggleMenu}
          />}
      </ListItem.Group>
    );
  }

  renderOptions() {
    return (
      <View>
        <ListItem
          onPress={() => {
            this.props.onSelect(this.props.data, 0);
          }}
        >
          <Text>Spieler wählen</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            this.props.onSelect(this.props.data, 1);
          }}
          last
        >
          <Text>Ergebnis eintragen</Text>
        </ListItem>
      </View>
    );
  }

  renderRow(set, idx) {
    const playerHome = set[`player_${idx + 1}_home`];
    const playerAway = set[`player_${idx + 1}_away`];

    return (
      <Row center key={idx}>
        <Column>
          <Text center>{this.getName(playerHome)}</Text>
        </Column>
        <Column fluid>
          {playerHome && <Image url={playerHome.image} size={32} />}
        </Column>
        <Column fluid center style={{ opacity: this.props.scoreInput ? 0 : 1 }}>
          <Score goals={set} />
        </Column>
        <Column fluid>
          {playerAway && <Image url={playerAway.image} size={32} />}
        </Column>
        <Column>
          <Text center>{this.getName(playerAway)}</Text>
        </Column>
      </Row>
    );
  }

  getName(player) {
    return !!player
      ? `${player.name} ${player.surname}`
      : this.props.editable ? 'Bitte wählen' : '';
  }
}

export default ListItemSet;
