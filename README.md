
# Kickern Hamburg
![App Icon](https://github.com/arnef/ligatool-hamburg/raw/master/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png "App Icon")

All information about the foosball-league of Hamburg.
Features of the App:

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
Comming soon.


