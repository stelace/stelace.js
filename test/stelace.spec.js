import test from 'blue-tape'

import { getSpyableStelace } from '../testUtils'

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
