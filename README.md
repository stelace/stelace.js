# Stelace Javascript SDK

The Stelace Javascript SDK provides convenient access to the Stelace API from applications written in server-side JavaScript or client-side.


## Usage

This package needs to be used with secret or public api keys that you can find in Stelace Dashboard.

``` js
const { createInstance } = require('stelace')
const stelace = createInstance({ apiKey: 'sk_test_...' })

const asset = await stelace.assets.create({
  name: 'Asset example'
})
```

Or with versions of Node.js prior to v7.9:

``` js
const Stelace = require('stelace')
const stelace = Stelace.createInstance({ apiKey: 'sk_test_...' })

stelace.assets.create({
  name: 'Asset example'
}, function (err, asset) {
  err // null if no error occurred
  asset // the created asset object
})
```

Or using ES modules, this looks more like:

``` js
import { createInstance } from 'stelace'
const stelace = createInstance({ apiKey: 'sk_test_...' })
//…
```


### Using Promises

Each method request returns a promise that you can use in place of callbacks:

``` js
// Create an asset type and create an asset with it
stelace.assetTypes.create({
  name: 'Renting',
  TIME: 'TIME_FLEXIBLE',
  QUANTITY: 'UNIQUE'
}).then(function (assetType) {
  return stelace.assets.create({
    name: 'Car',
    assetTypeId: assetType.id
  })
}).then(function (asset) {
  // Created asset
}).catch(function (err) {
  // Handle this error
})
```


### Configuring Timeout

Request timeout is configurable (the default is 30 seconds):

``` js
stelace.setTimeout(10000); // in ms (this is 10 seconds)
```

### Examining Responses

Some information about the response is provided in the `lastResponse` property as convenience:

```js
asset.lastResponse.requestId
asset.lastResponse.statusCode
```

When pagination is enabled in list endpoints, you can find the `paginationMeta` property:

```js
assets.paginationMeta.nbResults
assets.paginationMeta.nbPages
assets.paginationMeta.page
assets.paginationMeta.nbResultsPerPage
```

## Development

Run all tests:

```bash
$ npm install
$ npm test
```

Run tests in browser environments (Chrome and Firefox):
```bash
$ npm test:browser-local
```
