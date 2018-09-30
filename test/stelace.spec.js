import test from 'blue-tape'

import { getSpyableStelace, getStelaceStub } from '../testUtils'

import { Stelace, createInstance } from '../lib/stelace'

test('Sets the API key', (t) => {
  const stelace = createInstance({
    apiKey: 'sk_test_example1'
  })
  t.is(stelace.getApiField('key'), 'sk_test_example1')

  stelace.setApiKey('sk_test_example2')
  t.is(stelace.getApiField('key'), 'sk_test_example2')

  t.end()
})

test('Set a custom timeout', (t) => {
  const stelace = getSpyableStelace()

  t.is(stelace.getApiField('timeout'), Stelace.DEFAULT_TIMEOUT)

  stelace.setTimeout(100)
  t.is(stelace.getApiField('timeout'), 100)

  stelace.setTimeout(null)
  t.is(stelace.getApiField('timeout'), Stelace.DEFAULT_TIMEOUT)

  t.end()
})

test('Methods work with callback', (t) => {
  const stelace = getSpyableStelace()

  t.plan(2)

  stelace.categories.list((err, categories) => {
    t.notOk(err)
    t.ok(categories)
    t.end()
  })
})

test('Methods return a promise', (t) => {
  const stelace = getSpyableStelace()

  return stelace.categories.list()
    .then(categories => t.ok(categories))
    .catch(err => t.notOk(err))
})

test('Set the API version for a specific request', (t) => {
  const stelace = getSpyableStelace()

  return stelace.categories.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
    .then(() => {
      return stelace.categories.list({ stelaceVersion: '2018-07-30' })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2018-07-30'
        }
      })
    })
})

test('Set the target user for a specific request', (t) => {
  const stelace = getSpyableStelace()

  return stelace.categories.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
    .then(() => {
      return stelace.categories.list({ stelaceUserId: 'user_1' })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-user-id': 'user_1'
        }
      })
    })
})

test('Sets the token store', (t) => {
  const stelace = getSpyableStelace()

  const tokenStore = {
    getTokens: function () {},
    setTokens: function () {},
    removeTokens: function () {}
  }

  stelace.setTokenStore(tokenStore)
  t.is(stelace.getApiField('tokenStore'), tokenStore)
  t.end()
})

test('Methods returns lastResponse', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  stelace.stubRequest(`${baseURL}/assets/asset_1`, {
    status: 200,
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: { id: 'asset_1', name: 'Asset 1' }
  })

  return stelace.assets.read('asset_1')
    .then(asset => {
      t.deepEqual(asset, { id: 'asset_1', name: 'Asset 1' })
      t.deepEqual(asset.lastResponse, {
        statusCode: 200,
        requestId: 'f1f25173-32a5-48da-aa2f-0079568abea0'
      })
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Methods returns paginationMeta for list endpoints', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  stelace.stubRequest(`${baseURL}/assets`, {
    status: 200,
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: {
      nbResults: 2,
      nbPages: 1,
      page: 1,
      nbResultsPerPage: 10,
      results: [{ id: 'asset_1', name: 'Asset 1' }, { id: 'asset_2', name: 'Asset 2' }]
    }
  })

  return stelace.assets.list()
    .then(assets => {
      t.deepEqual(assets, [{ id: 'asset_1', name: 'Asset 1' }, { id: 'asset_2', name: 'Asset 2' }])
      t.deepEqual(assets.lastResponse, {
        statusCode: 200,
        requestId: 'f1f25173-32a5-48da-aa2f-0079568abea0'
      })
      t.deepEqual(assets.paginationMeta, {
        nbResults: 2,
        nbPages: 1,
        page: 1,
        nbResultsPerPage: 10
      })
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})
