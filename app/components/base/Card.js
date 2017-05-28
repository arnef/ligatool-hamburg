import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Touchable } from '../base';

class Card extends Component {
  render() {
    const { onPress } = this.props;

    const Container = onPress ? Touchable : View;

    return (
      <View style={style.container}>
        <Container onPress={onPress}>
          {this.props.children}
        </Container>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 8,
    marginVertical: 8,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.25,
    elevation: 2,
  },
});

export default Card;
