# Stelace Javascript SDK

The Stelace Javascript SDK provides convenient access to the Stelace API from applications written in server-side JavaScript or client-side.


## Usage

This package needs to be used with secret or public api keys that you can find in Stelace Dashboard.

``` js
const { createInstance } = require('stelace')
const stelace = createInstance({ apiKey: 'sk_test_...' })

const asset = await stelace.assets.create({
  name: 'Car'
})
```

Or with versions of Node.js prior to v7.9:

``` js
const Stelace = require('stelace')
const stelace = Stelace.createInstance({ apiKey: 'sk_test_...' })

stelace.assets.create({
  name: 'Car'
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


### Using user credentials

A public api key is used to identify your marketplace. Only public endpoints are accessible with it.
The public api keys are more suitable for user authentication when each user has its own permissions.

``` js
const { createInstance } = require('stelace')
const stelace = createInstance({ apiKey: 'pk_test_...' })

// Login as the user 'foo@example.com'
await stelace.auth.login({
  username: 'foo@example.com',
  password: 'secretPassword'
})

// Any actions performed will be associated to this user
await stelace.assets.create(...)

// Logout to destroy the current session
await stelace.auth.logout()
```

After successful login, the access and refresh tokens will be returned.

Stelace SDK handles the authentication for you and will automatically renew the access token when it's expired.


#### Token store

By default, Stelace provides a default token store for the authentication tokens storage.
The tokens are stored into localStorage in browser environment and into memory in Node.js.

But if a custom storage is needed, a token store can be provided at initialization:

```js
const myCustomTokenStore = {...}
const stelace = createInstance({ apiKey: 'pk_test_...', tokenStore: myCustomTokenStore })
```

or at run-time:

```js
stelace.setTokenStore(myCustomTokenStore)
```

A token store must be an object implementing the following functions:
- getTokens()
- setTokens(tokens: `object`)
- removeTokens()



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


### Options

Options are additional parameters that you can pass after the required arguments after any given method.

All methods can accept an optional `options` object containing one or more of the following:

- `stelaceVersion` - use a specific Stelace API version for this request
- `stelaceUserId` - perform the request as the specified user ID, needs specific permissions to do so
- `stelaceOrganizationId` - perform the request as the specified organization ID, the user must belong to the specified organization

This `options` object can be included as the last argument for any method:

```js
// Only the category data object
stelace.categories.create({
  name: 'Sport'
})

// The category data object and the options object
stelace.categories.create({
  name: 'Sport'
}, {
  stelaceVersion: '2018-07-30'
})
```


### Custom refresh token

As mentioned in the token store section, Stelace automatically refreshes the access token when it expires.
But in some case (e.g. external authentication), you may need a custom refresh workflow.

The function `beforeRefreshToken` can be provided at initialization:

```js
const myBeforeRefreshToken = function (tokens, cb) {
  getNewTokens(tokens, function (err, newTokens) {
    cb(err, newTokens)
  })
}

const stelace = createInstance({ apiKey: 'pk_test_...', beforeRefreshToken: myBeforeRefreshToken })
```

or at run-time:

```js
stelace.setBeforeRefreshToken(myBeforeRefreshToken)
```

The function `beforeRefreshToken` can also be a promise:

```js
const myBeforeRefreshToken = async function (tokens) {
  const newTokens = await getNewTokens(tokens)
  return newTokens
}
```

Note: The new tokens will be stored via the token store as is.


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


## SDK documentation

Most of the methods follow the same schema concerning arguments:

***Id**: `string` - Object ID

**queryParams**: `object` - Query parameters in GET requests (usually used for pagination)

**data**: `object` - Body of the request for POST/PATCH requests (usually used for the creation or the update of an object)

**options**: `object` - Options parameters described above

**callback**: `function` - Callback function. Omit it when using promises

The optional arguments are displayed within brackets.


### API keys

#### List API keys

stelace.apiKeys.list([queryParams], [options], [callback])

#### Read an API key

stelace.apiKeys.read(apiKeyId, [queryParams], [options], [callback])

#### Create an API key

stelace.apiKeys.create(data, [options], [callback])

#### Update an API key

stelace.apiKeys.update(apiKeyId, data, [options], [callback])

#### Remove an API key

stelace.apiKeys.remove(apiKeyId, [options], [callback])



### Assessments

#### List assessments

stelace.assessments.list([queryParams], [options], [callback])

#### Read an assessment

stelace.assessments.read(assessmentId, [queryParams], [options], [callback])

#### Create an assessment

stelace.assessments.create(data, [options], [callback])

#### Update an assessment

stelace.assessments.update(assessmentId, data, [options], [callback])

#### Remove an assessment

stelace.assessments.remove(assessmentId, [options], [callback])

#### Sign an assessment

stelace.assessments.sign(assessmentId, data, [options], [callback])



### Assets

#### List Assets

stelace.assets.list([queryParams], [options], [callback])

#### Read an Asset

stelace.assets.read(assetId, [queryParams], [options], [callback])

#### Create an Asset

stelace.assets.create(data, [options], [callback])

#### Update an Asset

stelace.assets.update(assetId, data, [options], [callback])

#### Remove an Asset

stelace.assets.remove(assetId, [options], [callback])



### Asset types

#### List Asset types

stelace.assetTypes.list([queryParams], [options], [callback])

#### Read an Asset type

stelace.assetTypes.read(assetTypeId, [queryParams], [options], [callback])

#### Create an Asset type

stelace.assetTypes.create(data, [options], [callback])

#### Update an Asset type

stelace.assetTypes.update(assetTypeId, data, [options], [callback])

#### Remove an Asset type

stelace.assetTypes.remove(assetTypeId, [options], [callback])



### Authentication

#### Login

stelace.auth.login(data, [options], [callback])

#### Get current session info

stelace.auth.info()

Returns an object with the following properties:
- **isAuthenticated**: `boolean`
- **userId**: `string|null`

#### Logout

stelace.auth.logout()



### Availability

#### List availabilities

stelace.availabilities.list([queryParams], [options], [callback])

#### Create an availability

stelace.availabilities.create(data, [options], [callback])

#### Update an availability

stelace.availabilities.update(availabilityId, data, [options], [callback])

#### Remove an availability

stelace.availabilities.remove(availabilityId, [options], [callback])


### Bookings

#### List bookings

stelace.bookings.list([queryParams], [options], [callback])

#### Read a booking

stelace.bookings.read(bookingId, [queryParams], [options], [callback])

#### Create a booking

stelace.bookings.create(data, [options], [callback])

#### Update a booking

stelace.bookings.update(bookingId, data, [options], [callback])

#### Accept a booking

stelace.bookings.accept(bookingId, data, [options], [callback])

#### Cancel a booking

stelace.bookings.cancel(bookingId, data, [options], [callback])


### Categories

#### List categories

stelace.categories.list([queryParams], [options], [callback])

#### Read a category

stelace.categories.read(categoryId, [queryParams], [options], [callback])

#### Create a category

stelace.categories.create(data, [options], [callback])

#### Update a category

stelace.categories.update(categoryId, data, [options], [callback])

#### Remove a category

stelace.categories.remove(categoryId, [options], [callback])



### Config

#### Read config

stelace.config.read([options], [callback])

#### Update config

stelace.config.update([data], [options], [callback])



### Custom attributes

#### List custom attributes

stelace.customAttributes.list([queryParams], [options], [callback])

#### Read a custom attribute

stelace.customAttributes.read(customAttributeId, [queryParams], [options], [callback])

#### Create a custom attribute

stelace.customAttributes.create(data, [options], [callback])

#### Update a custom attribute

stelace.customAttributes.update(customAttributeId, data, [options], [callback])

#### Remove a custom attribute

stelace.customAttributes.remove(customAttributeId, [options], [callback])



### Entries

#### List entries

stelace.entries.list([queryParams], [options], [callback])

#### Read an entry

stelace.entries.read(entryId, [queryParams], [options], [callback])

#### Create an entry

stelace.entries.create(data, [options], [callback])

#### Update an entry

stelace.entries.update(entryId, data, [options], [callback])

#### Remove an entry

stelace.entries.remove(entryId, [options], [callback])



### Events

#### List events

stelace.events.list([queryParams], [options], [callback])

#### Read an event

stelace.events.read(eventId, [queryParams], [options], [callback])



### Messages

#### List messages

stelace.messages.list([queryParams], [options], [callback])

#### Read an message

stelace.messages.read(messageId, [queryParams], [options], [callback])

#### Create an message

stelace.messages.create(data, [options], [callback])

#### Update an message

stelace.messages.update(messageId, data, [options], [callback])

#### Remove an message

stelace.messages.remove(messageId, [options], [callback])



### Password

#### Change the password

stelace.password.change(data, [options], [callback])

#### Send a password reset request

stelace.password.resetRequest(data, [options], [callback])

#### Send a password reset confirmation

stelace.password.resetConfirm(data, [options], [callback])



### Permissions

#### Check the permissions

stelace.permissions.check(data, [options], [callback])



### Ratings

#### Get ratings’ stats

stelace.ratings.getStats([queryParams], [options], [callback])

#### List ratings

stelace.ratings.list([queryParams], [options], [callback])

#### Read an rating

stelace.ratings.read(ratingId, [queryParams], [options], [callback])

#### Create an rating

stelace.ratings.create(data, [options], [callback])

#### Update an rating

stelace.ratings.update(ratingId, data, [options], [callback])

#### Remove an rating

stelace.ratings.remove(ratingId, [options], [callback])



### Roles

#### List roles

stelace.roles.list([queryParams], [options], [callback])

#### Read a role

stelace.roles.read(roleId, [queryParams], [options], [callback])

#### Create a role

stelace.roles.create(data, [options], [callback])

#### Update a role

stelace.roles.update(roleId, data, [options], [callback])

#### Remove a role

stelace.roles.remove(roleId, [options], [callback])



### Search

#### Search assets

stelace.search.list(data, [options], [callback])



### Transactions

#### Preview a transaction

stelace.transactions.preview(data, [options], [callback])

#### List transactions

stelace.transactions.list([queryParams], [options], [callback])

#### Read a transaction

stelace.transactions.read(transactionId, [queryParams], [options], [callback])

#### Create a transaction

stelace.transactions.create(data, [options], [callback])

#### Update a transaction

stelace.transactions.update(transactionId, data, [options], [callback])



### Transaction lines

#### Read a transaction line

stelace.transactionLines.read(transactionLineId, [queryParams], [options], [callback])

#### Create a transaction line

stelace.transactionLines.create(data, [options], [callback])

#### Update a transaction line

stelace.transactionLines.update(transactionLineId, data, [options], [callback])



### Transaction moves

#### Read a transaction move

stelace.transactionMoves.read(transactionMoveId, [queryParams], [options], [callback])

#### Create a transaction move

stelace.transactionMoves.create(data, [options], [callback])

#### Update a transaction move

stelace.transactionMoves.update(transactionMoveId, data, [options], [callback])



### Users

#### Check the username availability

stelace.users.checkAvailability(queryParams, [options], [callback])

#### List users

stelace.users.list([queryParams], [options], [callback])

#### Read a user

stelace.users.read(userId, [queryParams], [options], [callback])

#### Create a user

stelace.users.create(data, [options], [callback])

#### Update a user

stelace.users.update(userId, data, [options], [callback])

#### Remove a user

stelace.users.remove(userId, [options], [callback])

#### Update a user’s organizations config

stelace.users.updateOrganizations(userId, data, [options], [callback])




### Webhooks

#### List webhooks

stelace.webhooks.list([queryParams], [options], [callback])

#### Read a webhook

stelace.webhooks.read(webhookId, [queryParams], [options], [callback])

#### Create a webhook

stelace.webhooks.create(data, [options], [callback])

#### Update a webhook

stelace.webhooks.update(webhookId, data, [options], [callback])

#### Remove a webhook

stelace.webhooks.remove(webhookId, [options], [callback])



### Workflows

#### List workflows

stelace.workflows.list([queryParams], [options], [callback])

#### Read a workflow

stelace.workflows.read(workflowId, [queryParams], [options], [callback])

#### Create a workflow

stelace.workflows.create(data, [options], [callback])

#### Update a workflow

stelace.workflows.update(workflowId, data, [options], [callback])

#### Remove a workflow

stelace.workflows.remove(workflowId, [options], [callback])
