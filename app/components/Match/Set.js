import React, { Component } from 'react';
import { View } from 'react-native';
import Score from '../Score';
import ScoreInput from './ScoreInput';
import {
  ActionSheet,
  Card,
  Content,
  Column,
  Touchable,
  Text,
  Icon,
  Image,
} from '../../components/base';

class ListItemSet extends Component {
  showMenu() {
    ActionSheet.show(
      {
        options: ['Spieler wählen', 'Ergebnis eintragen'],
      },
      val => {
        if (val < 3) {
          this.props.onSelect(this.props.index, this.props.data, val);
        }
      },
    );
  }

  render() {
    const data = this.props.data;
    const Container =
      this.props.editable && !this.props.scoreInput ? Touchable : View;

    return (
      <Card>
        <Container onPress={this.showMenu.bind(this)}>
          <Content>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Column>
                <Text bold secondary>{`${data.name}`}</Text>
              </Column>
              {this.props.editable &&
                !this.props.scoreInput &&
                <Column fluid>
                  <Icon name="more" size={16} />
                </Column>}
            </View>
          </Content>
        </Container>
        {!this.props.scoreInput &&
          <Container
            onPress={
              this.props.onPress
                ? () => {
                    this.props.onPress(data);
                  }
                : null
            }
          >
            {data.sets.map((set, idx) => {
              return this.renderRow(set, idx);
            })}
          </Container>}
        {this.props.scoreInput &&
          <ScoreInput
            data={data}
            adjustPosition={this.props.adjustPosition}
            onSave={this.props.onSave}
            toggleMenu={this.props.toggleMenu}
          />}
      </Card>
    );
  }

  renderRow(set, idx) {
    const playerHome = set[`player_${idx + 1}_home`];
    const playerAway = set[`player_${idx + 1}_away`];
    const color = this.props.error ? 'red' : null;
    const Container = this.props.editable ? View : Touchable;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }} key={idx}>
        <Container
          onPress={() => this.props.openPlayer(playerHome)}
          style={{
            flexDirection: 'row',
            flex: 2,
            paddingBottom: 12,
            paddingLeft: 12,
            alignItems: 'center',
          }}
        >
          <Column>
            <Text center color={color}>
              {this.getName(playerHome)}
            </Text>
          </Column>
          <Column fluid>
            {playerHome && <Image url={playerHome.image} size={32} />}
          </Column>
        </Container>
        <Column
          fluid
          center
          style={{ opacity: this.props.scoreInput ? 0 : 1, paddingBottom: 12 }}
        >
          <Score goals={set} />
        </Column>
        <Container
          onPress={() => this.props.openPlayer(playerAway)}
          style={{
            flexDirection: 'row',
            flex: 2,
            paddingBottom: 12,
            paddingRight: 12,
            alignItems: 'center',
          }}
        >
          <Column fluid>
            {playerAway && <Image url={playerAway.image} size={32} />}
          </Column>
          <Column>
            <Text center color={color}>
              {this.getName(playerAway)}
            </Text>
          </Column>
        </Container>
      </View>
    );
  }

  getName(player) {
    return player
      ? `${player.name} ${player.surname}`
      : this.props.editable ? 'Bitte wählen' : '';
  }
}

export default ListItemSet;
