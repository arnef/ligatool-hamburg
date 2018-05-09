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

import { Text } from '@app/components';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  SectionList,
  View,
} from 'react-native';

import styles from './styles';

export interface IContentProps {
  /**
   *
   */
  sections?: any[];
  /**
   *
   */
  data?: any[];
  /**
   *
   */
  extraData?: any[];
  listEmptyText?: string;
  ListEmptyComponent?: React.ReactElement<any>;
  color?: string;
  renderItem?: (data: any) => React.ReactElement<any>;
  renderSectionHeader?: (section: any) => React.ReactElement<any>;
  renderSeparator?: React.ComponentType<any>;
  reference?: (content: Content) => void;
  onRefresh?: () => void;
}

export class Content extends React.PureComponent<IContentProps> {
  private list: any;

  constructor(props: IContentProps) {
    super(props);
    if (this.props.reference) {
      this.props.reference(this);
    }
  }

  public render() {
    const {
      onRefresh,
      color,
      listEmptyText,
      sections,
      renderItem,
      renderSectionHeader,
      renderSeparator,
      data,
      children,
    } = this.props;
    const Refresh = onRefresh ? (
      <RefreshControl
        colors={[color]}
        refreshing={false}
        onRefresh={onRefresh}
      />
    ) : null;
    const ListEmpty = listEmptyText
      ? this.renderEmptyComponent(listEmptyText)
      : this.props.ListEmptyComponent
        ? this.props.ListEmptyComponent
        : null;

    if (sections) {
      // section list view
      return (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderSeparator}
          stickySectionHeadersEnabled={true}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={ListEmpty}
          refreshControl={Refresh}
          ref={list => (this.list = list)}
        />
      );
    } else if (data) {
      // flat list view
      return (
        <FlatList
          data={data}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={ListEmpty}
          refreshControl={Refresh}
          extraData={this.props.extraData}
          ref={list => (this.list = list)}
        />
      );
    } else if (children) {
      // scroll list with children
      return <ScrollView refreshControl={Refresh}>{children}</ScrollView>;
    } else {
      // no data available show loading indicator
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={color} size="large" />
        </View>
      );
    }
  }

  public scrollToOffset = (params: {
    x: number;
    y: number;
    animated?: boolean;
  }) => {
    if (this.list && this.list.scrollToOffset) {
      setTimeout(() => {
        this.list.scrollToOffset(params);
      }, 100);
    }
  };

  private keyExtractor = (item: any, index: number) => {
    return item.id ? `${item.id}` : `content-${index}`;
  };

  private renderEmptyComponent = (text: string) => {
    return (
      <Text secondary style={styles.emptyListText}>
        {`${text}`}
      </Text>
    );
  };
}
