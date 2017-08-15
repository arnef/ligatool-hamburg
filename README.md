
# Kickern Hamburg
![App Icon](https://github.com/arnef/ligatool-hamburg/raw/master/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png "App Icon")

All information about the foosball-league of Hamburg.
Features der App:

- All results from league and cup
- Live score push notifications
- Tables and player statistics
- Live Scoring for your Team
- Postpone Match dates


[![App Store Button](http://arnefeil.de/app_store.png "App Store Button")](https://itunes.apple.com/de/app/kickern-hamburg/id1213993617?mt=8)
[![Play Store Button](http://arnefeil.de/play_store.png "Play Store Button")](https://play.google.com/store/apps/details?id=com.arnefeilligatool)

[Changelog](https://github.com/arnef/ligatool-hamburg/blob/master/CHANGELOG.md)

## Table of Content
- [Configure](#configure)
- [Install dependencies](#install-dependencies)
- [Run](#run)
- [API Docs](#api-docs)


## Configure
The `settings.js.sample` and the `MatchTypes` containing the settings for the leauge of Hamburg. After copy the sample settings you'r ready to [run the app](#run).

### App
In `app/config` create a `settings.js`. Just copy the `settings.js.sample` and adjust your settings.

### MatchTypes
Match types are defined in `app/config/MatchTypes`. The folder have to contain at least one `default.json`.
```javascript
[
  { 
    name: "Einzel (E1)",
    setsIdx: [1], 
    type: 1 
  }
]
```

  Name | Type | Description
 --- | --- | ---
 name | `string` | name of a game
 setsIdx | `Array<number>` | numbers of sets beloging to a game (the API returns a map of sets with the number as key. For more information read the [API docs](#api-docs))
 type | `number` | type of a game (1 for singles and 2 for doubles)
 halftime (optional) | `boolean` | if halftime key is set, the view renders a delimiter before this game
 extra (optional) | `boolean` | when all regular games were played and the match cannot end with a draw, those extra games will be rendered
 toggle (optional) | `object` | render a button to switch to an other MatchType. The object must contain the name of the MatchType and a title to display.

### `export function getType(match)`
In `app/config/MatchTypes/index.js` implement a function which will return the MatchType of the given match.


## Install dependencies

### Android

```sh
yarn install
# npm install
```

### iOS
Make sure [CocoaPods](https://cocoapods.org/) are installed.    

```sh
yarn install
# npm install
cd ios && pod install
```

## Run

```sh
react-native run-android
# react-native run-ios
```

## API Docs
Docs for API Version 1 are available [here](https://arnef.hopto.org/kickernhh). The current Version of the App uses API Version 2 (not documented yet).


