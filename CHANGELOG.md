<a name="0.11.0"></a>
# [0.11.0](https://github.com/arnef/ligatool-hamburg/compare/v0.10.2...v0.11.0) (2017-07-30)


### Bug Fixes

* catch errors in manifest api calls ([73dae2b](https://github.com/arnef/ligatool-hamburg/commit/73dae2b))
* don't use .bind(this) in render functions ([a68b2d2](https://github.com/arnef/ligatool-hamburg/commit/a68b2d2))
* remove border in navbar ([6604169](https://github.com/arnef/ligatool-hamburg/commit/6604169))
* update notifications and sync in background with server ([fd19e4d](https://github.com/arnef/ligatool-hamburg/commit/fd19e4d))


### Features

* add code push ([a4a5f27](https://github.com/arnef/ligatool-hamburg/commit/a4a5f27))
* add sentry ([843e008](https://github.com/arnef/ligatool-hamburg/commit/843e008))
* change match datetime ([52e16e6](https://github.com/arnef/ligatool-hamburg/commit/52e16e6))
* impl redux-ducks and redux-saga ([f448828](https://github.com/arnef/ligatool-hamburg/commit/f448828))
* save leagues for navigation ([febca99](https://github.com/arnef/ligatool-hamburg/commit/febca99))
* use more settings ([7dc5774](https://github.com/arnef/ligatool-hamburg/commit/7dc5774))



<a name="0.10.2"></a>
## 0.10.2 (2017-06-18)


### Bug Fixes

* dispatch error message string instead of exception object ([aa59bc2](https://github.com/arnef/ligatool-hamburg/commit/aa59bc2))
* don't query matches on every overview mount ([aab154c](https://github.com/arnef/ligatool-hamburg/commit/aab154c))
* flow types for navReducer state ([05b207d](https://github.com/arnef/ligatool-hamburg/commit/05b207d))
* import actions in appcontainer ([512e621](https://github.com/arnef/ligatool-hamburg/commit/512e621))
* query leagues in drawer first and only show spinner if leagues not fetched ([2016fcf](https://github.com/arnef/ligatool-hamburg/commit/2016fcf))
* remove params condition ([b88d380](https://github.com/arnef/ligatool-hamburg/commit/b88d380))
* replace backAndroid with backHandler ([793f9fb](https://github.com/arnef/ligatool-hamburg/commit/793f9fb))
* use correct spelled keys in login payload ([e9147df](https://github.com/arnef/ligatool-hamburg/commit/e9147df))
* various flow errors ([1e68ed3](https://github.com/arnef/ligatool-hamburg/commit/1e68ed3))


### Features

* upgrade to rn0.44 ([f0ddb16](https://github.com/arnef/ligatool-hamburg/commit/f0ddb16))



<a name="0.10.1"></a>
## 0.10.1 (2017-05-28)


### Bug Fixes

* change navigationoption to work with reactnavigation beta.11 ([8864ee1](https://github.com/arnef/ligatool-hamburg/commit/8864ee1))
* conflict in settingsview ([92f92f8](https://github.com/arnef/ligatool-hamburg/commit/92f92f8))
* merge drawer and nav reducer ([32c50c8](https://github.com/arnef/ligatool-hamburg/commit/32c50c8))
* **api:** add timestamp to get requests ([97f6288](https://github.com/arnef/ligatool-hamburg/commit/97f6288)), closes [#25](https://github.com/arnef/ligatool-hamburg/issues/25)
* move suggest score button to page top ([ce11c65](https://github.com/arnef/ligatool-hamburg/commit/ce11c65)), closes [#24](https://github.com/arnef/ligatool-hamburg/issues/24)
* upgrade to reactnavigation beta.11 ([b66fe7e](https://github.com/arnef/ligatool-hamburg/commit/b66fe7e))



<a name="0.10.1"></a>
## 0.10.1 (2017-05-25)


### Bug Fixes

* .gitignore ([f2775e3](https://github.com/arnef/ligatool-hamburg/commit/f2775e3))
* merge league data from server with local data ([0aa2392](https://github.com/arnef/ligatool-hamburg/commit/0aa2392))
* **Container:** check which scroll function to use ([2f1c1dc](https://github.com/arnef/ligatool-hamburg/commit/2f1c1dc)), closes [#23](https://github.com/arnef/ligatool-hamburg/issues/23)
* update line up if set has score ([a55451f](https://github.com/arnef/ligatool-hamburg/commit/a55451f))
* **DrawerView:** show reload button if no leagues ([fbd2a6b](https://github.com/arnef/ligatool-hamburg/commit/fbd2a6b))


### Features

* add player statistics ([e07cc3a](https://github.com/arnef/ligatool-hamburg/commit/e07cc3a))
* add settings entry to clear app cache ([5f441b7](https://github.com/arnef/ligatool-hamburg/commit/5f441b7)), closes [#22](https://github.com/arnef/ligatool-hamburg/issues/22)
* disable player if he played 2 doubles or 2 singles ([a1da325](https://github.com/arnef/ligatool-hamburg/commit/a1da325))
* update the ui ([f2c1b55](https://github.com/arnef/ligatool-hamburg/commit/f2c1b55))


### Performance Improvements

* use FlatList instead of ScrollView ([d25e332](https://github.com/arnef/ligatool-hamburg/commit/d25e332))



<a name="0.10.0"></a>
# 0.10.0 (2017-05-12)


### Bug Fixes

* add loading reducer to blacklist ([074eb39](https://github.com/arnef/ligatool-hamburg/commit/074eb39))
* app crash if number in text component ([17c4c3b](https://github.com/arnef/ligatool-hamburg/commit/17c4c3b))
* check if initial notification has a id ([d8c6ea9](https://github.com/arnef/ligatool-hamburg/commit/d8c6ea9))
* check token before app restored ([e8277b5](https://github.com/arnef/ligatool-hamburg/commit/e8277b5))
* clear match lists after query ([77d8f44](https://github.com/arnef/ligatool-hamburg/commit/77d8f44))
* different height at score input ([c2c2b58](https://github.com/arnef/ligatool-hamburg/commit/c2c2b58))
* don't toggle editable match while loading ([240371c](https://github.com/arnef/ligatool-hamburg/commit/240371c))
* ignore notif type if checking open match ([b07be37](https://github.com/arnef/ligatool-hamburg/commit/b07be37)), closes [#19](https://github.com/arnef/ligatool-hamburg/issues/19)
* move loading state to a single reducer ([2b11e28](https://github.com/arnef/ligatool-hamburg/commit/2b11e28))
* no automatic match selection ([6300231](https://github.com/arnef/ligatool-hamburg/commit/6300231))
* set default cardstack background color ([9127f22](https://github.com/arnef/ligatool-hamburg/commit/9127f22))
* set fix width for table rows ([92ceddf](https://github.com/arnef/ligatool-hamburg/commit/92ceddf))
* show active item in drawer ([e41b384](https://github.com/arnef/ligatool-hamburg/commit/e41b384))
* show login in modal on my team tab ([d97857c](https://github.com/arnef/ligatool-hamburg/commit/d97857c))
* sort matches ([4dbcaa4](https://github.com/arnef/ligatool-hamburg/commit/4dbcaa4))
* use different methods for android and ios ([fc6b619](https://github.com/arnef/ligatool-hamburg/commit/fc6b619))
* **android:** add preview screen to stack ([e216529](https://github.com/arnef/ligatool-hamburg/commit/e216529))
* **android:** match header disappear on score confirm ([ffbf74f](https://github.com/arnef/ligatool-hamburg/commit/ffbf74f))
* **ios:** open overview tab before open match ([a303685](https://github.com/arnef/ligatool-hamburg/commit/a303685))


### Features

* **android:** show notification banner ([a77ae52](https://github.com/arnef/ligatool-hamburg/commit/a77ae52))
* check line up on insert ([85fd116](https://github.com/arnef/ligatool-hamburg/commit/85fd116)), closes [#18](https://github.com/arnef/ligatool-hamburg/issues/18) [#21](https://github.com/arnef/ligatool-hamburg/issues/21)
* use apisaucre request transform ([284d286](https://github.com/arnef/ligatool-hamburg/commit/284d286))
* use redux-persist ([e2c18da](https://github.com/arnef/ligatool-hamburg/commit/e2c18da))
