import React, { Component } from 'react'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { TabBar } from '../components'
import { connect } from 'react-redux'
import MatchListView from './MatchListView'
import { backgroundColor } from '../components/base/theme'

class Overview extends Component {


  componentDidMount() {
    const { matches } = this.props

    if (!matches.fetched && !matches.loading) {
      this.props.queryMatches()
    }
  }


  render() {
    const props = {
      error: this.props.matches.error,
      fetched: this.props.matches.fetched,
      onRefresh: this.props.queryMatches.bind(this),
      refreshing: this.props.matches.fetching
    }


    return (
      <ScrollableTabView
        style={{ backgroundColor, flex: 1 }}
        prerenderingSiblingsNumber={2}
        renderTabBar={() => (
          <TabBar />)}>
        <MatchListView {...this.props} { ...props } tabLabel='HEUTE' matches={this.props.matches.today} />
        <MatchListView {...this.props} { ...props } tabLabel='KOMMENDE' matches={this.props.matches.next} />
        <MatchListView {...this.props} { ...props } tabLabel='VERGANGENE' matches={this.props.matches.played} />
      </ScrollableTabView>
    )
  }
}

Overview.propTypes = {
  matches: React.PropTypes.object,
  queryMatches: React.PropTypes.func
}

export default connect(state => ({
  matches: state.matches
}))(Overview)
