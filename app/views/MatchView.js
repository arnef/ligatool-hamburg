import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { Container, Toolbar, Button, Match } from '../components';
import SelectPlayerModal from '../modals/SelectPlayerModal';


class MatchView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            btnIdx: 0,
            editable: true
        };
    }

    componentDidMount() {
        this.getMatch();
    }

    componentWillReceiveProps(nextProps) {
        const match = nextProps.match.data;
        let idx = 0;
        let editable = true;
        if (match.score_unconfirmed && !match.live) {
            idx = nextProps.auth.team.ids.indexOf(match.score_suggest) !== -1 ? 1 : 2;
        } else if (!match.score_unconfirmed && match.set_points) {
            editable = false;
            console.tron.log('match is editable ' + editable);
        }

        this.setState({ 
            btnIdx: idx,
            editable: editable
        });
    }

    getMatch() {
        this.props.getMatch(this.props.id, true);
    }

    onPress(data) {
        if (data.sets[0].player_1_home && data.sets[0].player_1_away) {
            this.showScoreDialog(data);
        } else {
            this.showPlayerDialog(data.sets[0].player_1_home ? 'away' : 'home', data)
        }
    }

    onLongPress(data) {
        this.showPlayerDialog('home', data);
    }


    showScoreDialog(data) {
        if (this.scoreDialog) {
            this.props.showScoreDialog();
            this.scoreDialog.setData(data);
            this.scoreDialog.result = (score) => {
                const sets = { ...this.props.match.data.sets };
                const idx = data.setsIdx[score.set];
                const set = { ...data.sets[score.set] };
                set.number = idx;
                set.goals_home = score.goals_home;
                set.goals_away = score.goals_away;
                sets[idx] = set;
                this.props.updateSets(this.props.match.data.id, sets);
            }

        }
    }

    showPlayerDialog(team, data) {
        const match = this.props.match.data;
        const team_key = `team_${team}`;
        if (this.SelectPlayerModal && match[team_key] && match[team_key].player) {
            this.props.showPlayerDialog();
            this.SelectPlayerModal.setSelection(data.type);
            this.SelectPlayerModal.setTitle(`${data.type === 1 ? 'Spieler':'Doppel'} wählen`);
            this.SelectPlayerModal.setItems(match[team_key].player);

            this.SelectPlayerModal.result = (result) => {
                this.props.setPlayer(team, result, data.setsIdx);
                if (team === 'home') {
                    this.props.hidePlayerDialog();
                    this.showPlayerDialog('away', data);
                } else {
                    this.props.hidePlayerDialog();
                }
            }
        }
    }

    confirmScore() {
        const match = this.props.match.data;
        if (this.state.btnIdx !== 1) {
            this.props.suggestScore(match.id, match.sets, this.state.btnIdx);
        }
    }
    
    showButton() {
        const match = this.props.match.data;
        if (match.league && match.league.name.indexOf('pokal') !== -1) {
            return match.score_unconfirmed && (match.set_points_home !== match.set_points_away &&  (match.set_points_home > 16 || match.set_points_away > 16)) ? true : false;
        } else {
            return match.score_unconfirmed && (match.set_points_home + match.set_points_away === 32) ? true : false;
        }
    }

    render() {
        const match = this.props.match.data;
        const showButton =  this.showButton();
        return (
            <View style={{ flex: 1}}>
                <SelectPlayerModal
                    { ...this.props }
                    ref={(dialog) => { this.SelectPlayerModal = dialog; }}
                    visible={this.props.dialog.player }
                />
                <Match.Score
                    ref={(dialog) => { this.scoreDialog = dialog; }}
                    visible={this.props.dialog.score.visible }
                    refreshing={this.props.dialog.score.loading }
                    onRequestClose={ () => { this.props.hideScoreDialog() }}
                />
                <Toolbar.Match data={match} />
                <Container error={this.props.match.error}
                    refreshing={this.props.match.loading}
                    onRefresh={this.getMatch.bind(this)}>
                    <Match editable={this.state.editable}
                            toggleMatchType={this.props.toggleMatchType.bind(this)}
                           onPress={this.onPress.bind(this) }
                           onLongPress={this.onLongPress.bind(this)}
                    />
                </Container>
                { showButton && (
                    <Button block 
                        primary={this.state.btnIdx !== 1}
                        disabled={this.state.btnIdx === 1}
                        color={this.props.settings.color } 
                        onPress={this.state.btnIdx !== 1 ? this.confirmScore.bind(this) : null}>
                        { `${btnText[this.state.btnIdx]}` }
                    </Button>
                )}
            </View>
        );
    }
}

const btnText = [
    'Ergebnis vorschlagen',
    'Ergebnis vorgeschlagen',
    'Ergebnis akzeptieren'
];

MatchView.propTypes = {
    getMatch: React.PropTypes.func,
    id: React.PropTypes.number,
    showScoreDialog: React.PropTypes.func,
    match: React.PropTypes.object,
    updateSets: React.PropTypes.func,
    showPlayerDialog: React.PropTypes.func,
    setPlayer: React.PropTypes.func,
    hidePlayerDialog: React.PropTypes.func,
    suggestScore: React.PropTypes.func,
    dialog: React.PropTypes.object,
    hideScoreDialog: React.PropTypes.func,
    toggleMatchType: React.PropTypes.func,
    settings: React.PropTypes.object
};

export default connect( (state) => ({
    match: state.match
}))(MatchView);