import React, {Component} from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MatchListView from '../views/MatchListView';
import { Toolbar } from '../components';


class MyTeam extends Component {

    componentDidMount() {
        if (!this.props.teamMatches.fetched) {
            this.props.queryTeamMatches();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.auth.team && nextProps.auth.team && !nextProps.teamMatches.fetched) {
            this.props.queryTeamMatches();      
            this.props.setTitle('Mein Team');     
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
                renderTabBar={() => (<Toolbar.Tabs />)}>
                <MatchListView tabLabel="KOMMENDE" {...this.props} {...props} matches={this.props.teamMatches.next} />
                <MatchListView tabLabel="VERGANGENE" {...this.props} { ...props} matches={this.props.teamMatches.played} />
            </ScrollableTabView>
        );
    }
}



MyTeam.propTypes = {
    style: React.PropTypes.object,
    teamMatches: React.PropTypes.object,
    auth: React.PropTypes.object,
    queryTeamMatches: React.PropTypes.func
};

export default connect(state => ({
    auth: state.auth,
    teamMatches: state.teamMatches
}))(MyTeam);
