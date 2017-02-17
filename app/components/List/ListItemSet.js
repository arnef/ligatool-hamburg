import React, { Component } from 'react';
import { View } from 'react-native';
import ListItemGroup from './ListItemGroup';
import { Row, Column, Text } from '../Styles';
import Image from '../Image';
import Score from '../Score';

class ListItemSet extends Component {

    render() {
        const data = this.props.data;
        
        return (
            <ListItemGroup 
                center
                onPress={this.props.editable && !!this.props.onPress ? () => { this.props.onPress(data)} : null}
                onLongPress={this.props.editable && !!this.props.onLongPress ? () => { this.props.onLongPress(data)} : null}
                name={data.name} padding>
                <Row>
                    <Column center>
                        { this.getPlayerHome(data.sets[0], 1) }
                        { data.type === 2 && this.getPlayerHome(data.sets[0], 2) }
                    </Column>
                    <Column center style={{flex: 0.5}}>
                        { data.sets.map( (set, idx) => {
                            return (<Score key={idx} goals={set} />);
                        })}
                    </Column>
                    <Column center>
                        { this.getPlayerAway(data.sets[0], 1) }
                        { data.type === 2 && this.getPlayerAway(data.sets[0], 2) }
                    </Column>
                </Row>
            </ListItemGroup>
        );
    }

    getName(player) {
        return !!player ? `${player.name} ${player.surname}` : this.props.editable ? 'Bitte wählen' : '';
    }

    getPlayerHome(data, nr) {
        const player = data[`player_${nr}_home`];
        return (
            <Row center>
                <Column center>
                    <Text center>{ this.getName(player) }</Text>
                </Column>
                <Column style={{flex: 0,width: imageSize }}>
                    { !!player && !!player.image && (<Image url={player.image} size={imageSize} /> ) }
                </Column>
            </Row>
        );
    }

    getPlayerAway(data, nr) {
        const player = data[`player_${nr}_away`];
        return (
            <Row center>
                <Column style={{flex: 0, width: imageSize}}>
                    { !!player && !!player.image && (<Image url={player.image} size={imageSize} />) }
                </Column>
                <Column center>
                    <Text center>{ this.getName(player) }</Text>
                </Column>
            </Row>
        )
    }
}

const imageSize = 32;

export default ListItemSet;