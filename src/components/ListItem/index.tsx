/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import { ListItem } from './Item';
import { Group } from './Group';
import { ConnectedHeader } from './Header';
import { Icon, Image } from '@app/components';

const iconSize = 32;

function ListItemImage(props: any) {
  return <Image size={iconSize} style={{ marginRight: 16 }} {...props} />;
}

function ListItemIcon(props: any) {
  return (
    <Icon
      size={iconSize}
      style={{ marginRight: props.right ? 0 : 16, textAlign: 'center' }}
      color={props.right ? '#909090' : '#474747'}
      {...props}
    />
  );
}

ListItem.Image = ListItemImage;
ListItem.Icon = ListItemIcon;
ListItem.Group = Group;
ListItem.Header = ConnectedHeader;

export default ListItem;
