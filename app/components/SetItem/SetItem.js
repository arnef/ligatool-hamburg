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
      <Text center style={styles.textPlayer}>
        {`${props.player
          ? `${props.player.name} ${props.player.surname}`
          : props.editable ? S.SELECT : ''}`}
      </Text>
      {props.player && <Image url={props.player.image} size={32} />}
    </View>
  );
}

function PlayerAway(props) {
  return (
    <View style={styles.containerPlayer}>
      {props.player && <Image url={props.player.image} size={32} />}
      <Text center style={styles.textPlayer}>
        {`${props.player
          ? `${props.player.name} ${props.player.surname}`
          : props.editable ? S.SELECT : ''}`}
      </Text>
    </View>
  );
}

function Set(props) {
  const Container = props.editable ? View : Touchable;
  return (
    <View style={styles.containerPlayers}>
      <Container
        onPress={() => props.openPlayer(props[`homePlayer${props.idx + 1}`])}
        style={styles.containerPlayer}
      >
        <PlayerHome
          editable={props.editable}
          player={props[`homePlayer${props.idx + 1}`]}
        />
      </Container>
      <Score goals={props.result} />
      <Container
        onPress={() => props.openPlayer(props[`awayPlayer${props.idx + 1}`])}
        style={styles.containerPlayer}
      >
        <PlayerAway
          editable={props.editable}
          player={props[`awayPlayer${props.idx + 1}`]}
        />
      </Container>
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
  return (
    <Card>
      <Container onPress={showMenu} style={styles.container}>
        <View style={styles.containerTitle}>
          <Text bold secondary style={styles.textTitle}>{`${props.data
            .name}`}</Text>
          {props.editable &&
            <Icon style={styles.iconTitle} name="more" size={16} />}
        </View>
      </Container>
      <Container onPress={onPress}>
        {props.data.gameNumbers.map((gameNumber, idx) =>
          <Set
            {...props.set(gameNumber)}
            openPlayer={props.openPlayer}
            editable={props.editable}
            idx={idx}
            key={`set-${gameNumber}`}
          />,
        )}
      </Container>
    </Card>
  );
}

export default connect((state, props) => ({
  set: gameNumber => getFixtureGame(state, props.fixtureId, gameNumber),
}))(SetItem);
