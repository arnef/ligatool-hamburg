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

import { ASSOC } from './config/settings';

export function darken(color: string, amt: number): string {
  const hsl: number[] = color.match(/\d+/g).map(i => parseInt(i, 10));

  return `hsl(${hsl[0]},${hsl[1]}%,${hsl[2] - amt * 100}%)`;
}

export function lighten(color: string, amt: number): string {
  const hsl: number[] = color.match(/\d+/g).map(i => parseInt(i, 10));
  return `hsl(${hsl[0]},${hsl[1]}%,${hsl[2] + amt * 100}%)`;
}

export function hex2hsl(color: string): string {
  const r = parseInt(color.substring(1, 3), 16) / 255;
  const g = parseInt(color.substring(3, 5), 16) / 255;
  const b = parseInt(color.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h / 6;
  }
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  h = Math.round(360 * h);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getMatchDays(matches: any[]): any {
  const matchDays: {
    matchdays: { [key: string]: string[] };
    selected?: string;
  } = {
    matchdays: {},
    selected: null,
  };
  if (matches.length > 0) {
    for (const match of matches) {
      if (!matchDays.matchdays[match.matchday]) {
        matchDays.matchdays[match.matchday] = [];
      }
      matchDays.matchdays[match.matchday].push(`${match.id}`);
      if (!match.result && !matchDays.selected) {
        matchDays.selected = match.matchday;
      }
    }
    if (!matchDays.selected) {
      matchDays.selected = matches[matches.length - 1].matchday;
    }
  }

  return { match_days: matchDays.matchdays, selected: matchDays.selected };
}

export const sortCompetition = (c: any): string | number => {
  if (ASSOC.indexOf('dtfb') !== -1) {
    if (c.name.indexOf('Senioren') !== -1) {
      return 10;
    } else if (c.name.indexOf('Damen') !== -1) {
      return 9;
    }

    if (c.name.indexOf('2.') !== -1) {
      return 8;
    }
    if (c.name.indexOf('Vorrunde') !== -1) {
      return 5;
    }

    return 0;
  }
  return c.name;
};
