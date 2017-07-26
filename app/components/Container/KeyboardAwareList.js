// @flow
import React from 'react';
import {
  Keyboard,
  TextInput,
  UIManager,
  Dimensions,
  View,
  Platform,
} from 'react-native';
import Container from './Container';

const windowHeight = Dimensions.get('screen').height;

export default class KeyboardAwareList extends React.Component {
  state: {
    scrollOffsetY: number,
    keyboardHeight: number,
  };
  onScroll: Function;
  onShowKeyboard: Function;
  onHideKeyboard: Function;
  scrollToInput: Function;
  keyboardDidShowListener: { remove: Function };
  keyboardWillHideListener: { remove: Function };
  container: { scrollTo: Function };

  constructor(props) {
    super(props);

    this.state = {
      scrollOffsetY: 0,
      keyboardHeight: 0,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onShowKeyboard = this.onShowKeyboard.bind(this);
    this.onHideKeyboard = this.onHideKeyboard.bind(this);
    this.scrollToInput = this.scrollToInput.bind(this);
  }

  componentDidMount() {
    if (!this.keyboardDidShowListener) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.onShowKeyboard,
      );
    }
    if (!this.keyboardWillHideListener) {
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.onHideKeyboard,
      );
    }
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove();
    }
  }

  onShowKeyboard(frames) {
    if (frames.endCoordinates && this.state.keyboardHeight === 0) {
      this.setState(
        { keyboardHeight: frames.endCoordinates.height },
        this.scrollToInput,
      );
    }
  }

  onHideKeyboard() {
    this.setState({ keyboardHeight: 0 });
  }

  onScroll(event) {
    this.setState({ scrollOffsetY: event.nativeEvent.contentOffset.y });
  }

  scrollToInput() {
    const focusedInput = TextInput.State.currentlyFocusedField();
    if (focusedInput) {
      UIManager.measureInWindow(focusedInput, (x, y, width, height) => {
        const visibleHeight =
          windowHeight - this.state.keyboardHeight - height - 70;
        const keyboardDistance = y - visibleHeight;

        if (keyboardDistance > 0 && this.container) {
          this.container.scrollTo({
            x: 0,
            y: this.state.scrollOffsetY + keyboardDistance,
            animated: true,
          });
        }
      });
    }
  }

  render() {
    const { renderRow, dataSource, ...rest } = this.props;
    const height =
      this.state.keyboardHeight > 0
        ? this.state.keyboardHeight - (Platform.OS === 'ios' ? 70 : 0)
        : 0;

    return (
      <Container
        {...rest}
        onScroll={this.onScroll}
        getRef={scrollview => (this.container = scrollview)}
      >
        {(dataSource || []).map((item, index) => renderRow({ item, index }))}
        <View style={{ height }} />
      </Container>
    );
  }
}
