import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import MatchListView from '../views/MatchListView'
import { TabBar } from '../components'


class MyTeam extends Component {

    componentDidMount() {
        if (!this.props.teamMatches.fetched && !this.props.teamMatches.loading) {
            this.props.queryTeamMatches()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.settings.team && nextProps.settings.team
            && !nextProps.teamMatches.fetched) {
            console.tron.log('logged in query matches')
            this.props.queryTeamMatches()
            this.props.setTitle('Mein Team')
        }
    }

    render() {
        const props = {
            error: this.props.teamMatches.error,
            onRefresh: this.props.queryTeamMatches.bind(this),
            refreshing: this.props.teamMatches.loading
        }

        return (
            <ScrollableTabView
                style={this.props.style}
                prerenderingSiblingsNumber={1}
                renderTabBar={() => (<TabBar />)}>
                <MatchListView tabLabel='KOMMENDE' {...this.props} {...props} matches={this.props.teamMatches.next} />
                <MatchListView tabLabel='VERGANGENE' {...this.props} { ...props} matches={this.props.teamMatches.played} />
            </ScrollableTabView>
        )
    }
}



MyTeam.propTypes = {
    auth: PropTypes.object,
    queryTeamMatches: PropTypes.func,
    setTitle: PropTypes.func,
    settings: PropTypes.object,
    style: PropTypes.object,
    teamMatches: PropTypes.object
}

export default connect(state => ({
    auth: state.auth,
    settings: state.settings,
    teamMatches: state.teamMatches
}))(MyTeam)
