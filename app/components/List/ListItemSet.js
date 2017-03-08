import React, { Component } from 'react';
import { View } from 'react-native';
import Menu, {
    MenuOptions, MenuOption, MenuTrigger
} from 'react-native-menu';
import ListItemGroup from './ListItemGroup';
import { Row, Column, Text, Button } from '../../components';
import Touchable from '../Touchable';
import Image from '../Image';
import Icon from '../Icon';
import Score from '../Score';

class ListItemSet extends Component {

    render() {
        const data = this.props.data;
        
        const dropdown = this.props.editable ? (
            <Menu onSelect={this.props.editable && !!this.props.onSelect ? (value) => { this.props.onSelect(data, value) } : () => { alert('no select')}}>
                        <MenuTrigger>
                            <Touchable style={{paddingVertical: 8, paddingHorizontal: 16}}>
                                <Icon name='more' size={20} />
                            </Touchable>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption value={1}>
                                <Text>Spieler wählen</Text>
                            </MenuOption>
                            <MenuOption value={2}>
                                <Text>Ergebnis eintragen</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
        ) : null;
        return (
            <ListItemGroup
                center
                onPress={this.props.editable && !!this.props.onPress ? () => { this.props.onPress(data) } : null}
                name={this.props.data.name} 
                dropdown={dropdown}
                padding>
                <Row>
                    <Column center>
                        {this.getPlayerHome(data.sets[0], 1)}
                        {data.type === 2 && this.getPlayerHome(data.sets[0], 2)}
                    </Column>
                    <Column center style={{ flex: 0.5 }}>
                        {data.sets.map((set, idx) => {
                            return (<Score key={idx} goals={set} />);
                        })}
                    </Column>
                    <Column center>
                        {this.getPlayerAway(data.sets[0], 1)}
                        {data.type === 2 && this.getPlayerAway(data.sets[0], 2)}
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
                    <Text center>{this.getName(player)}</Text>
                </Column>
                <Column style={{ flex: 0, width: imageSize }}>
                    {!!player && !!player.image && (<Image url={player.image} size={imageSize} />)}
                </Column>
            </Row>
        );
    }

    getPlayerAway(data, nr) {
        const player = data[`player_${nr}_away`];
        return (
            <Row center>
                <Column style={{ flex: 0, width: imageSize }}>
                    {!!player && !!player.image && (<Image url={player.image} size={imageSize} />)}
                </Column>
                <Column center>
                    <Text center>{this.getName(player)}</Text>
                </Column>
            </Row>
        )
    }
}

const imageSize = 32;

export default ListItemSet;