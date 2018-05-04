import { ASSOC } from './config/settings';

export function darken(color: string, amt: number): string {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  r = Math.max(Math.round(r - 255 * amt), 0).toString(16);
  g = Math.max(Math.round(g - 255 * amt), 0).toString(16);
  b = Math.max(Math.round(b - 255 * amt), 0).toString(16);

  return '#' + ('0' + r).slice(-2) + ('0' + g).slice(-2) + ('0' + b).slice(-2);
}

export function lighten(color: string, amt: number): string {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  r = Math.min(Math.round(r + 255 * amt), 255).toString(16);
  g = Math.min(Math.round(g + 255 * amt), 255).toString(16);
  b = Math.min(Math.round(b + 255 * amt), 255).toString(16);

  return '#' + ('0' + r).slice(-2) + ('0' + g).slice(-2) + ('0' + b).slice(-2);
}

export function getMatchDays(matches: Array<any>): any {
  const matchDays = {
    matchdays: {},
    selected: null,
  };
  if (matches.length > 0) {
    for (let match of matches) {
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
