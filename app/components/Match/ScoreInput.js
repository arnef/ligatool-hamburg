import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Row, Column, Touchable, Text } from '../../components/base';
import * as theme from '../../components/base/theme';

class ScoreInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            set: 0,
            goals_home: null,
            goals_away: null
        };
    }

    componentDidMount() {
        let idx = 0;
        const sets = this.props.data.sets;
        for (let i = 0; i < sets.length-1; i++) {
            if (sets[i].goals_home != null && sets[i].goals_away != null) {
                idx = i+1;
            }
        }
        this.setState({
            set: idx
        })
    }

    render() {
        const player_1_home = this.props.data.sets ? this.props.data.sets[0].player_1_home : {};
        const player_1_away = this.props.data.sets ? this.props.data.sets[0].player_1_away : {};
        const player_2_home = this.props.data.sets ? this.props.data.sets[0].player_2_home : null;
        const player_2_away = this.props.data.sets ? this.props.data.sets[0].player_2_away : null;
        
        return (
            <View>
            <Row center style={{margin: 10}}>
                <Column center>
                    <Text center>
                        { this.getName(player_1_home)}
                        { player_2_home && '\n-\n'+this.getName(player_2_home)}
                    </Text>
                    <Column style={styles.score}>
                        { this.renderInputField('goals_home') }
                    </Column>
                </Column>
                <Column center>
                    <Text center>
                        { this.getName(player_1_away)}
                        { player_2_away && '\n-\n'+this.getName(player_2_away)}
                    </Text>
                    <Column style={styles.score}>
                        { this.renderInputField('goals_away') }
                    </Column>
                </Column>
            </Row>
            <Row style={styles.buttonRow}>
                <Column>
                    {( this.state.set > 0 &&
                        <Touchable onPress={this.goBack.bind(this)}>
                        <Text style={styles.buttonText} upperCase={Platform.OS === 'android'}>1. Satz</Text>
                    </Touchable>)}
                </Column>
                <Column style={styles.vSeparator}>
                    <Touchable onPress={this.props.toggleMenu}>
                        <Text style={styles.buttonText} upperCase={Platform.OS === 'android'}>Abbrechen</Text>
                    </Touchable>
                </Column>
                <Column>
                    <Touchable onPress={this.onSave.bind(this)}>
                        <Text style={styles.buttonText} upperCase={Platform.OS === 'android'}>Speichern</Text>
                    </Touchable>
                </Column>
            </Row>
            </View>
        )
    }

    renderInputField(key) {
        let otherKey = 'goals_away'
        if (key === 'goals_away') {
            otherKey = 'goals_home';
        }
        return (
            <TextInput 
                keyboardType='numeric'
                value={this.state[key]}
                maxLength={1}
                ref={input => { this.inputField = input }}
                keyboardAppearance='dark'
                selectionColor='#fff'
                onFocus={this.onFocus.bind(this)}
                onChangeText={value => {
                    const newState={};
                    newState[key] = value;
                    this.setState(newState);
                    const goals = parseInt(value, 10);
                    if (!this.state[otherKey] && goals < 6) {
                        newState[otherKey] = goals === 5 ? '5' : '6';
                        this.setState(newState);
                        setTimeout(this.onSave.bind(this), 50);
                    }
                }}
                style={styles.input} />
        )
    }

    onFocus() {
        const input = this.inputField;
        // console.tron.log(JSON.stringify(Object.keys(input)));
        input.measure((fx, fy, width, height, px, py) => {
            console.tron.log(`position: ${py}`);
            this.props.adjustPosition(py);
        })
        // console.tron.log(input.measureLayout)
    }

    onSave() {
        this.props.onSave(this.props.data, {
            set: this.state.set,
            goals_home: parseInt(this.state.goals_home, 10),
            goals_away: parseInt(this.state.goals_away, 10)
        });
    }

    goBack() {
        this.setState({
            set: this.state.set-1
        });
    }

    getName(player) {
        return `${player.name} ${player.surname}`;
    }
}

const styles = StyleSheet.create({
    vSeparator: {
        borderLeftWidth: 1,
        borderLeftColor: theme.backgroundColor,
        borderRightWidth: 1,
        borderRightColor: theme.backgroundColor
    },
    buttonText: {
        marginVertical: 10,
        // color: '#5e5e5e',
        color: theme.secondaryTextColor,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonRow: {
        // backgroundColor: '#f3f3f3',
        borderTopWidth: 1,
        borderTopColor: theme.backgroundColor,
    },
    score: {
        backgroundColor: '#666',
        borderRadius: 6,
        margin: 16,
        width: 60,
        marginTop: 10,
        marginBottom: 0
    },
    input: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 24,
        height: 30,
        margin: 8,
        fontWeight: 'bold',
        fontFamily: Platform.select({
            ios: 'Courier New',
            android: 'monospace'
        })
    }
});

export default ScoreInput;