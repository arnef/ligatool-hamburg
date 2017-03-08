import React, { Component } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text
} from 'react-native';
import Dialog from './Dialog';
import Button from '../../Button';
import ButtonBar from './ButtonBar';

class ScoreDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            set: 0,
            button3: false,
            goals_home: null,
            goals_away: null,
        };
    }

    setData(data) {
        let idx = 0;
        for (let i = 0; i < data.sets.length-1; i++) {
            if (data.sets[i].goals_home != null && data.sets[i].goals_away != null) {
                idx = i+1;
            }
        }
        console.tron.log('set idx = ' + idx);
        this.setState({
            data: data,
            set: idx,
            goals_home: null,
            goals_away: null
        });
        this.dialog.setTitle('Ergebnis ' + data.name + (idx > 0 ? ` ${idx+1}. Satz`:''));
    }

    onPress() {
        if (this.result) {
            // this.dialog.setRefreshing(true);
            this.result({
                set: this.state.set,
                goals_home: parseInt(this.state.goals_home, 10),
                goals_away: parseInt(this.state.goals_away, 10)
            });
        }
    }

    goBack() {
        const idx = this.state.set - 1;
        this.setState({
            set: idx
        });
        this.dialog.setTitle('Ergebnis ' + this.state.data.name + (idx > 0 ? ` ${idx+1}. Satz`:''));
    }

    render() {
        const player_1_home = this.state.data.sets ? this.state.data.sets[0].player_1_home : {};
        const player_1_away = this.state.data.sets ? this.state.data.sets[0].player_1_away : {};
        const player_2_home = this.state.data.sets ? this.state.data.sets[0].player_2_home : null;
        const player_2_away = this.state.data.sets ? this.state.data.sets[0].player_2_away : null;
        return (
            <Dialog {...this.props }
                    ref={ dialog => { this.dialog = dialog }}>
                <View style={style.row}>
                    <View style={style.player}>
                        <Text style={style.playerName}>
                            { `${player_1_home.name} ${player_1_home.surname}`}
                            { player_2_home && `\n-\n${player_2_home.name} ${player_2_home.surname}` }
                        </Text>
                    </View>
                    <View style={style.player}>
                        <Text style={style.playerName}>
                            { `${player_1_away.name} ${player_1_away.surname}` }
                            { player_2_away && `\n-\n${player_2_away.name} ${player_2_away.surname}` }
                        </Text>
                    </View>
                </View>
                <View style={style.row}>
                    <View style={style.player}>
                        <View style={style.score}>
                            <TextInput style={style.input} keyboardType='numeric'
                                       value={this.state.goals_home}
                                       onChangeText={value => {
                                           this.setState({ goals_home: value });
                                           const goals = parseInt(value, 10);
                                           if (!this.state.goals_away && goals < 6) {
                                               this.setState({ goals_away: goals === 5 ? '5' : '6' });
                                               setTimeout(this.onPress.bind(this), 50);
                                           }
                                       }}
                            />
                        </View>
                    </View>
                    <View style={style.player}>
                        <View style={style.score}>
                            <TextInput style={style.input} keyboardType='numeric'
                                       value={this.state.goals_away}
                                       onChangeText={value => {
                                           this.setState({ goals_away: value });
                                           const goals = parseInt(value, 10);
                                           if (!this.state.goals_home && goals < 6) {
                                               this.setState({ goals_home: goals === 5 ? '5' : '6' });
                                               setTimeout(this.onPress.bind(this), 50);
                                           }
                                       }}
                            />
                        </View>
                    </View>
                </View>
                <ButtonBar>
                    <Button onPress={this.onPress.bind(this)} basic>
                        Speichern
                    </Button>
                    <Button onPress={this.props.onRequestClose.bind(this)} basic>
                        Abbrechen
                    </Button>
                    { this.state.set > 0 && (
                        <Button onPress={this.goBack.bind(this)} basic>
                            { `${this.state.set}. Satz` }
                        </Button>
                    )}
                </ButtonBar>
            </Dialog>
        )
    }
}
const style = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    player: {
        flexDirection: 'column',
        flex: 1,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 0
    },
    playerName: {
        textAlign: 'center'
    },
    score: {
        backgroundColor: '#666',
        borderRadius: 6,
        margin: 16,
        marginTop: 0,
        marginBottom: 0
    },
    input: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 24,
        height: 60,
        padding: 8,
        margin: 0
    }
});

ScoreDialog.propTypes = {
    onRequestClose: React.PropTypes.func
};
export default ScoreDialog;
