import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class ButtonBar extends Component {
  

  render() {
    const button1 = this.props.children.map ? this.props.children[0] : this.props.children;
    let button2 = (<View />);
    let button3 = (<View />);
    if (this.props.children.length > 1) {
      button2 = this.props.children[1];
    }
    if (this.props.children.length > 2) {
      button3 = this.props.children[2];
    }

    return (
      <View style={style.bar}>
        { button3 }
        <View style={{flex: 1}} />
        { button2 }
        { button1 }          
      </View>
    );
  }
}

const style = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    margin: 2,
    marginLeft: 6
  }
});

ButtonBar.propTypes = {
  children: React.PropTypes.array
}

export default ButtonBar;
