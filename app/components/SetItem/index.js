import React from 'react';
import { View } from 'react-native';
import Card from '../Card';
import Touchable from '../Touchable';
import Text from '../Text';
import Icon from '../Icon';
import Image from '../Image';
import Score from '../Score';
import ActionSheet from '../ActionSheet';
import styles from './styles';

import S from '../../lib/strings';
import { connect } from 'react-redux';
import { getFixtureGame } from '../../redux/modules/fixtures';

function PlayerHome(props) {
  return (
    <View style={styles.containerPlayer}>
      <Text center style={styles.textPlayer} numberOfLines={2}>
        {`${
          props.player
            ? `${props.player.name} ${props.player.surname}`
            : props.editable ? S.SELECT : ''
        }`}
      </Text>
      {props.player && <Image url={props.player.image} size={32} />}
    </View>
  );
}

function PlayerAway(props) {
  return (
    <View style={styles.containerPlayer}>
      {props.player && <Image url={props.player.image} size={32} />}
      <Text center style={styles.textPlayer} numberOfLines={2}>
        {`${
          props.player
            ? `${props.player.name} ${props.player.surname}`
            : props.editable ? S.SELECT : ''
        }`}
      </Text>
    </View>
  );
}

function SetItem(props) {
  const Container = props.editable ? Touchable : View;

  function showMenu() {
    ActionSheet.show(
      {
        options: [S.SELECT_PLAYER, S.INSERT_SCORE],
      },
      val => {
        if (val < 3) {
          props.onSelect(props.index, props.data, val);
        }
      },
    );
  }

  function onPress() {
    const { homePlayer1, awayPlayer1 } = props.set(props.data.gameNumbers[0]);
    if (homePlayer1 && awayPlayer1) {
      props.onSelect(props.index, props.data, 1);
    } else {
      props.onSelect(props.index, props.data, 0);
    }
  }
  const PContainer = props.editable ? View : Touchable;
  const set = props.set(props.data.gameNumbers[0]);
  return (
    <Card>
      <Container onPress={showMenu} style={styles.container}>
        <View style={styles.containerTitle}>
          <Text bold secondary style={styles.textTitle}>{`${
            props.data.name
          }`}</Text>
          {props.editable && (
            <Icon style={styles.iconTitle} name="more" size={16} />
          )}
        </View>
      </Container>
      <Container
        onPress={onPress}
        style={{ flexDirection: 'row', paddingBottom: 8, paddingHorizontal: 4 }}
      >
        <View style={styles.containerPlayers}>
          <PContainer onPress={() => props.openPlayer(set.homePlayer1)}>
            <PlayerHome editable={props.editable} player={set.homePlayer1} />
          </PContainer>
          {props.data.type === 'DOUBLES' && (
            <PContainer onPress={() => props.openPlayer(set.homePlayer2)}>
              <PlayerHome editable={props.editable} player={set.homePlayer2} />
            </PContainer>
          )}
        </View>
        <View style={{ justifyContent: 'space-around' }}>
          {props.data.gameNumbers.map(gameNumber => (
            <Score
              goals={props.set(gameNumber).result}
              key={`goals-${gameNumber}`}
              style={{ marginVertical: 3 }}
            />
          ))}
        </View>
        <View style={styles.containerPlayers}>
          <PContainer onPress={() => props.openPlayer(set.awayPlayer1)}>
            <PlayerAway editable={props.editable} player={set.awayPlayer1} />
          </PContainer>
          {props.data.type === 'DOUBLES' && (
            <PContainer onPress={() => props.openPlayer(set.awayPlayer2)}>
              <PlayerAway editable={props.editable} player={set.awayPlayer2} />
            </PContainer>
          )}
        </View>
      </Container>
    </Card>
  );
}

export default connect((state, props) => ({
  set: gameNumber => getFixtureGame(state, props.fixtureId, gameNumber),
}))(SetItem);
