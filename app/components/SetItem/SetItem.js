// @flow
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

type SetItemProps = {
  data: Sets,
  onSelect: Function,
  editable: boolean,
};

type SetProps = {
  editable: boolean,
  openPlayer: Function,
};

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

function Set(props: SetProps): ReactElement<any> {
  const Container = props.editable ? View : Touchable;
  return (
    <View style={styles.containerPlayers}>
      <Container
        onPress={() => props.openPlayer(props[`player_${props.idx + 1}_home`])}
        style={styles.containerPlayer}
      >
        <PlayerHome
          editable={props.editable}
          player={props[`player_${props.idx + 1}_home`]}
        />
      </Container>
      <Score goals={props} />
      <Container
        onPress={() => props.openPlayer(props[`player_${props.idx + 1}_away`])}
        style={styles.containerPlayer}
      >
        <PlayerAway
          editable={props.editable}
          player={props[`player_${props.idx + 1}_away`]}
        />
      </Container>
    </View>
  );
}

export default function SetItem(props: SetItemProps): ReactElement<any> {
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
    if (props.data.sets[0].player_1_home && props.data.sets[0].player_1_away) {
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
        {props.data.sets.map((set, idx) =>
          <Set
            {...set}
            openPlayer={props.openPlayer}
            editable={props.editable}
            idx={idx}
            key={`set-${idx}`}
          />,
        )}
      </Container>
    </Card>
  );
}
