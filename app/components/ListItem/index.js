import React from 'react';
import ListItem from './Item';
import ListItemGroup from './Group';
import Header from './Header';
import Image from '../Image';
import Icon from '../Icon';
import { colors } from '../../config/styles';

const iconSize = 32;

function ListItemImage(props) {
  return <Image size={iconSize} style={{ marginRight: 16 }} {...props} />;
}

function ListItemIcon(props) {
  return (
    <Icon
      size={iconSize}
      style={{ marginRight: props.right ? 0 : 16, textAlign: 'center' }}
      color={props.right ? colors.TEXT_SECONDARY : colors.TEXT_PRIMARY}
      {...props}
    />
  );
}

ListItem.Image = ListItemImage;

ListItem.Icon = ListItemIcon;

ListItem.Group = ListItemGroup;

ListItem.Header = Header;

export default ListItem;