# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.13.0 (2020-02-10)

### ⚠ BREAKING CHANGES

* bump minimum Node version to 10.18

### Features

* add `auth.check` method ([d7a186a](https://github.com/stelace/stelace.js/commit/d7a186a2b3c347e082eaac6f4f25c5589735ab02))
* add forward methods ([799b150](https://github.com/stelace/stelace.js/commit/799b150fb1696cf9ca73df7aec917a83932969a9))

### Build

* bump minimum Node version from 8.9 to 10.18 ([9f0073f](https://github.com/stelace/stelace.js/commit/9f0073f7d8b8f9a708e803f2bfcdf5058e7844d0))

## 0.12.0 (2020-01-15)

This release reduces bundle size using improvements in babel configuration [f5ff808](https://github.com/stelace/stelace.js/commit/f5ff808735e6aa3ba60aa76d185f5667b08da35c).

### ⚠ BREAKING CHANGES

* bump minimum Node version to 8.17

### Bug Fixes

* do not add Basic Auth header when apiKey is missing ([678e357](https://github.com/stelace/stelace.js/commit/678e35777323879a8b6a0933338307b72e9061c5))

### Build

* bump minimum Node version to 8.17 ([01a9f2a](https://github.com/stelace/stelace.js/commit/01a9f2ade002d2e3f4703ee5af068b805f76dda3))


## 0.11.0 (2020-01-15)

### Features

* Adapt availability calls and search results to new API format ([2cd0ec3](https://github.com/stelace/stelace.js/commit/2cd0ec34fa09af38ec335e3d7e9b84c221e7ed16))
* Add `stelace.getTokenStore()`  to retrieve custom or default token store ([41c6089](https://github.com/stelace/stelace.js/commit/41c60892edf77a697556c5aa6a3ba42fe3b44d77))
* Add check permissions method ([ddd3f90](https://github.com/stelace/stelace.js/commit/ddd3f90b892613d03629fb4fcf648e8a19723aad))
* Add create action for Event ([c85b756](https://github.com/stelace/stelace.js/commit/c85b756cdb3ccb8366d5591b47e6f8b6edd25729))
* add CRUD for tasks ([dbee6aa](https://github.com/stelace/stelace.js/commit/dbee6aac8feb8f88d8540daa42b64b6f518c6dc8))
* Add endpoints accessible by current user (authentication and password) ([b1d199e](https://github.com/stelace/stelace.js/commit/b1d199e17ff448d7cbd2b732149ddca133d9a89c))
* Add Entry resource ([c66e48a](https://github.com/stelace/stelace.js/commit/c66e48a9e044b38bbddf7dc1e2d7fdfc33ad7c9e))
* add get token action for external authentication ([33138a9](https://github.com/stelace/stelace.js/commit/33138a9930d722add2dbc1064cedc6f244a48fb7))
* Add getGraph action for availabilities ([6ed5cbf](https://github.com/stelace/stelace.js/commit/6ed5cbf0135bcfacf7f59927ef4f59f72d143acf))
* Add pay, confirm and process actions for booking ([740afbb](https://github.com/stelace/stelace.js/commit/740afbb84c876e0b31a87ac234e302ec4c1e1a2c))
* add preview action for transactions ([6abc6cd](https://github.com/stelace/stelace.js/commit/6abc6cd69d23640e241085ec439a363b4bf96e40))
* add private config actions ([92728a8](https://github.com/stelace/stelace.js/commit/92728a866124ab897880dd65867ddca7f0f863a5))
* Add rating and message resources ([fa00a03](https://github.com/stelace/stelace.js/commit/fa00a03240b20ca19330dd52def69fdd81fef39e))
* add saved search actions ([#4](https://github.com/stelace/stelace.js/issues/4)) ([2747bcd](https://github.com/stelace/stelace.js/commit/2747bcdfba132652976d8b8008df41ff3f22866d))
* Add Stripe request action ([b582fdc](https://github.com/stelace/stelace.js/commit/b582fdcfc7f0730f917cc47d7ad041b12dec87b8))
* Add Token resource ([8aa6cf1](https://github.com/stelace/stelace.js/commit/8aa6cf1342bfb49d9a397f57814031207c2499ab))
* Add Transaction, TransactionLine and TransactionMove resources ([a604baf](https://github.com/stelace/stelace.js/commit/a604bafb79c2b8871d398f5e757ac8622a2f0d92))
* add user session expiration notification ([35bbda7](https://github.com/stelace/stelace.js/commit/35bbda719d4bff96ddb432fc75ca7aad321fa1cf))
* automatically remove auth tokens when user session expires ([b020810](https://github.com/stelace/stelace.js/commit/b020810467ea7c71910ae50c12f20ed1a39c6ec2))
* Implement SDK core ([91fba54](https://github.com/stelace/stelace.js/commit/91fba5419003c76a5f4f190e795477b2afcbbf3d))
* Providing `beforeRefreshToken` function will override the default refresh token process ([9d1afa0](https://github.com/stelace/stelace.js/commit/9d1afa0636a878661353ae204d5093474f0bad14))
* relax apiKey tests to accept custom keys ([b793a26](https://github.com/stelace/stelace.js/commit/b793a266a2551168c7480b02b57fa385576e2825))
* Remove `stelaceOrganizationId` for a specific request ([ac5a440](https://github.com/stelace/stelace.js/commit/ac5a440b494de44646ca81091187a95c4174ce48))
* Remove booking old actions ([e377765](https://github.com/stelace/stelace.js/commit/e377765101faeeb2aa66dc7752336118cc71fdeb))
* stelace custom authorization header scheme ([6351a06](https://github.com/stelace/stelace.js/commit/6351a062ce7d1710cc9b170b26cf6b363833b78d))
* stelaceOrganizationId can be provided globally or per request ([4c99882](https://github.com/stelace/stelace.js/commit/4c99882dc27b3322659137fcbaf2896a5bfd8f4a))


### Bug Fixes

* API key in basic auth must be encoded in base64 ([57c0572](https://github.com/stelace/stelace.js/commit/57c0572f3838c115bd46c95a30e6743bbdf1700d))
* array response not cloned properly ([dc7f6e9](https://github.com/stelace/stelace.js/commit/dc7f6e93266a155bc95a12fb51b6701e11c71bec))
* Do not override the user agent in browser environment ([135df95](https://github.com/stelace/stelace.js/commit/135df951236f66f123dda56e43c537069b01081d))
* Fix typo in README.md ([83da282](https://github.com/stelace/stelace.js/commit/83da282ce1abcbd965f6b04863471222db2a8058))
* missing comma between auth-params in Stelace-V1 Authorization scheme ([f70413a](https://github.com/stelace/stelace.js/commit/f70413a053618db54e163d55e6a64cdabe888641))
* **testUtils:** `encodeJwtToken` parameters aren't correctly passed ([0bcf54c](https://github.com/stelace/stelace.js/commit/0bcf54c590124fdb2dc544c7da84f1526f5fe1b9))
* **util:** empty arrays aren't correctly cloned ([4de62e8](https://github.com/stelace/stelace.js/commit/4de62e884ea96ee573f998d9381c2f42a83130be))
