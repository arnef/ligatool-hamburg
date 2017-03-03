import React, { Component } from 'react';
import { View } from 'react-native';
import formats from './formats';
import { connect } from 'react-redux';
import { ListItemSet, ListItemSwitch } from '../List';
import ScoreDialog from './ScoreDialog';

class Match extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'default',
            editable: true
        };
    }

    setType(type) {
        this.setState({
            type: type
        });
    }

    componentWillReceiveProps(nextProps) {
        const cup = nextProps.match.data.league && nextProps.match.data.league.name.indexOf('pokal') !== -1;
        console.tron.log(`is match cup ? ${!!cup}`);
        let type = 'default';
        if (!!cup) {
            type = 'cup';
        } else {
            type = 'default';
            const sets = nextProps.match.data.sets || {};
            if (sets['5'] != null && sets['6'] != null) {
                if (sets['5'].player_2_home != null && sets['6'].player_2_home) {
                    type = 'd5';
                }
            }
        }
        if (this.state.type != type) {
            console.tron.log('change match type to ' + type);
            this.setState({
                type
            });
        }
        
    }

    renderRow(data, idx) {
        return (
            <View key={idx}>
                { !!data.toggle && this.props.editable && (
                    <ListItemSwitch 
                        onValueChange={() => {
                            
                            this.props.toggleMatchType(data.setsIdx);
                            this.setState({ type: data.toggle.type })
                        }}
                        value={this.state.type === 'd5'}>{ data.toggle.title }</ListItemSwitch>
                ) }
                <ListItemSet 
                    onPress={this.props.onPress ? () => { this.props.onPress(data)} : null}
                    onLongPress={this.props.onLongPress ? () => { this.props.onLongPress(data)} : null}
                    editable={this.state.editable}
                    data={data} />
            </View>
        );
    }

    getName(data, key) {
        return data[key] ? `${data[key].name} ${data[key].surname}` : this.props.editable ? 'Bitte wählen' : '';
    }

    buildMatchData() {
        const editMatch = this.props.editable;
        const match = this.props.match.data.sets ? this.props.match.data : {sets: []};
        const sets = [];
        const format = formats[this.state.type];
        for (let set of format) {
            const data = { ...set };
            data.sets = [];
            for(let setIdx of data.setsIdx) {
                if (match.sets[setIdx]) {
                    data.sets.push(match.sets[setIdx]);
                } else if (editMatch) {
                    if (!data.extra || (data.extra && match.set_points_home >= 16 && match.set_points_away >= 16)) {
                        data.sets.push({});
                    }
                }
            }
            if (data.sets.length > 0) {
                sets.push(data);
            }
        }
        return sets;
    }

    render() {
        const sets = this.buildMatchData();
        return (
            <View>
                { sets.map((set, idx) => {
                    return this.renderRow(set, idx);
                })}
            </View>
        );
    }
}

Match.propTypes = {
    type: React.PropTypes.string
};

Match.Score = ScoreDialog;

export default connect( (state) => ({
    match: state.match
}))(Match);
