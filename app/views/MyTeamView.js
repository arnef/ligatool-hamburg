import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MatchListView from '../views/MatchListView';
import { TabBar } from '../components';


class MyTeam extends Component {

    componentDidMount() {
        if (!this.props.teamMatches.fetched) {
            this.props.queryTeamMatches();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.settings.team && nextProps.settings.team
            && !nextProps.teamMatches.fetched) {
            console.tron.log('logged in query matches');
            this.props.queryTeamMatches();
            this.props.navigator.setTitle('Mein Team');
        }
    }

    render() {
        const props = {
            refreshing: this.props.teamMatches.loading,
            error: this.props.teamMatches.error,
            onRefresh: this.props.queryTeamMatches.bind(this)
        }

        return (
            <ScrollableTabView
                style={this.props.style}
                prerenderingSiblingsNumber={1}
                renderTabBar={() => (<TabBar />)}>
                <MatchListView tabLabel="KOMMENDE" {...this.props} {...props} matches={this.props.teamMatches.next} />
                <MatchListView tabLabel="VERGANGENE" {...this.props} { ...props} matches={this.props.teamMatches.played} />
            </ScrollableTabView>
        );
    }
}



MyTeam.propTypes = {
    style: React.PropTypes.object,
    settings: React.PropTypes.object,
    navigator: React.PropTypes.object,
    teamMatches: React.PropTypes.object,
    auth: React.PropTypes.object,
    queryTeamMatches: React.PropTypes.func
};

export default connect(state => ({
    auth: state.auth,
    settings: state.settings,
    teamMatches: state.teamMatches
}))(MyTeam);
