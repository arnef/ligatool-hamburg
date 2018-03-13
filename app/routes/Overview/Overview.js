import React from 'react';
import { ListView, View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import S from '../../lib/strings';
import Routes from '../../config/routes';
import { MatchItem, Text } from '../../components';
import ErrorFlash from '../../components/ErrorFlash';
import * as OverviewActions from '../../redux/modules/overview';
import { colors } from '../../config/styles';
import { size } from 'lodash';
import { getFixture } from '../../redux/modules/fixtures';
import { getColor } from '../../redux/modules/user';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 != s2,
    });

    this.state = {
      data: this.ds.cloneWithRowsAndSections(
        props.matches.data || {},
        props.matches.sections || [],
      ),
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.matches.data !== nextProps.matches.data) {
      this.setState({
        data: this.ds.cloneWithRowsAndSections(
          nextProps.matches.data,
          nextProps.matches.sections,
        ),
      });
    }
  }

  renderItem(item) {
    return <MatchItem data={this.props.getFixture(item)} />;
  }

  renderSectionHeader(data, sectionId) {
    return (
      <View style={{ paddingTop: 4, elevation: 5, alignItems: 'center' }}>
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
            backgroundColor: colors.BACKGROUND,
          }}
        >
          <Text bold>{`${sectionId}`}</Text>
        </View>
      </View>
    );
  }

  renderEmpty() {
    return (
      <Text secondary style={{ padding: 16, textAlign: 'center' }}>{`${
        this.props.loading ? '' : 'Keine Begegnungen'
      }`}</Text>
    );
  }

  render() {
    // const { matches } = this.props;
    const Refresh = (
      <RefreshControl
        colors={[this.props.color]}
        refreshing={this.props.loading}
        onRefresh={this.props.queryMatches}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        <ErrorFlash
          error={this.props.error}
          onRefresh={this.props.queryMatches}
        />
        <ListView
          refreshControl={Refresh}
          style={{ flex: 1 }}
          enableEmptySections={true}
          renderHeader={
            this.props.matches && size(this.props.matches.data) > 0
              ? null
              : this.renderEmpty
          }
          dataSource={this.state.data}
          renderSectionHeader={
            this.props.matches.sections &&
            this.props.matches.sections.length > 1
              ? this.renderSectionHeader
              : null
          }
          renderRow={this.renderItem}
        />
      </View>
    );
    // return <MatchList matches={matches} onRefresh={this.props.queryMatches} />;
  }
}

function createTab(keyName) {
  return connect(
    state => ({
      error: state.loading.error,
      loading: state.loading.list,
      matches: state.overview[keyName],
      getFixture: id => getFixture(state, id),
      color: getColor(state),
    }),
    dispatch => ({
      queryMatches: () => dispatch(OverviewActions.getMatches()),
    }),
  )(Overview);
}

export default TabNavigator(
  {
    [Routes.TAB_MATCHES_PLAYED]: {
      screen: createTab('played'),
      navigationOptions: { title: S.PAST_MATCHES },
    },
    [Routes.TAB_MATCHES_TODAY]: {
      screen: createTab('today'),
      navigationOptions: { title: S.TODAY },
    },
    [Routes.TAB_MATCHES_NEXT]: {
      screen: createTab('next'),
      navigationOptions: { title: S.NEXT_MATCHES },
    },
  },
  {
    ...NavTabBarTop,
    initialRouteName: Routes.TAB_MATCHES_TODAY,
    lazy: false,
  },
);
