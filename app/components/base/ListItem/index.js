import React from 'react';
import { Platform } from 'react-native';
import ListItem from './Item';
import ListItemGroup from './Group';
import Header from './Header';
import Image from '../Image';
import Icon from '../Icon';
import * as theme from '../theme';


const iconSize = Platform.OS === 'ios' ? 29 : 24;

ListItem.Image = (props) => (
    <Image size={iconSize} 
        style={{marginRight: 16}}
        { ...props} />
);

ListItem.Icon = (props) => (
    <Icon size={iconSize}
        style={{marginRight: props.right ? 0 : 16, textAlign: 'center'}}
        color={props.right ? theme.secondaryTextColor : theme.primaryTextColor}
        { ...props } />
);

ListItem.Group = ListItemGroup;

ListItem.Header = Header;

export default ListItem;