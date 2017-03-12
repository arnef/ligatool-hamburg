import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { Container, Toolbar, Match } from '../components';
import SelectPlayerModal from '../modals/SelectPlayerModal';
import { Button } from '../ui';
import * as theme from '../ui/theme';

class MatchView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            btnIdx: 0,
            editable: true,
            menuOpen: -1,
            scoreInput: -1
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


    toggleMenu(idx) {
        if (this.state.menuOpen === idx) {
            this.setState({ menuOpen: -1, scoreInput: -1 });
        }
        else if (this.state.scoreInput === idx) {
            this.setState({ menuOpen: -1, scoreInput: -1 });
        }
        else {
            this.setState({ menuOpen: idx, scoreInput: -1 });
        }
    }

    getMatch() {
        this.props.getMatch(this.props.id, true);
    }

    onPress(data, idx) {
        if (data.sets[0].player_1_home && data.sets[0].player_1_away) {
            // this.showScoreDialog(data);
            this.toggleScoreInput(idx)
        } else {
            this.showPlayerDialog(data.sets[0].player_1_home ? 'away' : 'home', data)
        }
    }


    onSelect(data, value) {
        this.toggleMenu(-1);
        if (value === 0) {
            this.showPlayerDialog('home', data);
        }
        if (value === 1) {
            this.setState({ scoreInput: this.state.menuOpen });
            // if (data.sets[0].player_1_home && data.sets[0].player_1_away) {
            //     this.showScoreDialog(data);
            // }
        }
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

    onSave(data, score) {
        const sets = { ...this.props.match.data.sets };
        const idx = data.setsIdx[score.set];
        const set = { ...data.sets[score.set] };
        set.number = idx;
        set.goals_home = score.goals_home;
        set.goals_away = score.goals_away;
        sets[idx] = set;
        this.props.updateSets(this.props.match.data.id, sets);
        this.setState({ scoreInput: -1 });
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

    toggleScoreInput(idx) {
        if (this.state.scoreInput === idx) {
            this.setState({ scoreInput: -1, menuOpen: -1 });
        } else {
            this.setState({ scoreInput: idx, menuOpen: -1 });
        }
    }

    render() {
        const match = this.props.match.data;
        const showButton =  this.showButton();
        return (
            <View style={{ flex: 1, backgroundColor: theme.backgroundColor}}>
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
                <Toolbar.Match data={match} navigator={this.props.navigator} />
                <Container 
                    { ...this.props }
                    hasTabbar={this.props.hasTabbar && !showButton}
                    error={this.props.match.error}
                    refreshing={this.props.match.loading}
                    onRefresh={this.getMatch.bind(this)}>

                    <Match editable={this.state.editable}
                           toggleMatchType={this.props.toggleMatchType.bind(this)}
                           onPress={this.onPress.bind(this)}
                           scoreInput={this.state.scoreInput}
                           toggleMenu={this.toggleMenu.bind(this)}
                           menuOpen={this.state.menuOpen}
                           onSave={this.onSave.bind(this)}
                           onSelect={this.onSelect.bind(this)}
                    />
                </Container>
                { showButton && (
                    <View style={{margin: 8, paddingBottom: this.props.hasTabbar ? 54:0}}>
                    <Button block 
                        primary={this.state.btnIdx !== 1}
                        disabled={this.state.btnIdx === 1}
                        color={this.props.settings.color } 
                        onPress={this.confirmScore.bind(this)}>
                        { `${btnText[this.state.btnIdx]}` }
                    </Button>
                    </View>
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