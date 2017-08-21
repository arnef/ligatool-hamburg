// @flow
import React from 'react';
import { View, Platform } from 'react-native';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { colors } from '../../config/styles';
import { Touchable, Icon } from '../../components';
import Routes from '../../config/routes';

class SearchHeader extends React.Component {
  renderSearchBar() {
    const height =
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version >= 21)
        ? 20
        : 0;
    return <View style={{ backgroundColor: this.props.color, height }} />;
  }

  render() {
    console.log(this.props);
    const { state } = this.props.navigation;
    if (state.index === 0) {
      return this.renderSearchBar();
    }

    const { style, ...rest } = this.props;
    const headerStyle = [style];
    headerStyle.push({
      backgroundColor: this.props.color,
    });
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      headerStyle.push({
        borderTopWidth: 20,
        borderTopColor: this.props.color,
        height: 56 + 20,
      });
    }

    return <Header {...rest} style={headerStyle} />;
  }
}

const ConnectHeader = connect(state => ({
  color: state.settings.color,
}))(SearchHeader);

export default {
  cardStyle: { backgroundColor: colors.BACKGROUND },
  navigationOptions: ({ navigation }) => {
    const headerStyle =
      navigation.state.routeName === Routes.TEAM
        ? {
            elevation: 0,
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: { height: 0 },
            borderBottomWidth: 0,
          }
        : null;
    return {
      header: (props: any) => <ConnectHeader {...props} />,
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerPressColorAndroid: 'rgba(255, 255, 255, .8)',
      headerStyle,
    };
  },
};
