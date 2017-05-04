import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

class Row extends Component {
  render() {
    const { center, style, fluid } = this.props;
    const rowStyle = [styles.row];

    if (center) {
      rowStyle.push(styles.center);
    }

    if (fluid) {
      rowStyle.push(styles.fluid);
    }
    if (style) {
      rowStyle.push(style);
    }

    return (
      <View style={rowStyle}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  fluid: {
    paddingHorizontal: 0
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 8
  }
});

Row.defaultProps = {
  center: false,
  children: [],
  fluid: false,
  style: {}
};

Row.propTypes = {
  center: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  fluid: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

export default Row;
