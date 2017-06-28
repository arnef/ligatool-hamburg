import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Text, Touchable } from '../base';
import { connect } from 'react-redux';

class Button extends Component {
  render() {
    const { onPress, disabled, color, loading, outline } = this.props;
    const buttonStyle = [styles.button];

    buttonStyle.push({ borderColor: color, borderWidth: 1 });
    if (!outline) {
      buttonStyle.push({ backgroundColor: color });
    }

    if (disabled) {
      buttonStyle.push(styles.disabled);
    }
    const android = Platform.OS === 'android';
    const Container = disabled || loading ? View : Touchable;

    return (
      <Container
        onPress={onPress}
        style={buttonStyle}
        pressColor={outline ? color : 'rgba(255,255,255,0.7)'}
      >
        <Text color={outline ? color : '#fff'} bold={android}>
          {android ? this.props.title.toUpperCase() : this.props.title}
        </Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 2,
    padding: 8,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default connect(state => ({
  color: state.settings.color,
}))(Button);
