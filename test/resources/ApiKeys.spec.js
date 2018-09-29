import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.apiKeys.list({ page: 2, nbResultsPerPage: 10 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/api-keys',
        data: {},
        queryParams: { page: 2, nbResultsPerPage: 10 },
        headers: {}
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.apiKeys.read('apiKey_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/api-keys/apiKey_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.apiKeys.create({ name: 'My API key' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/api-keys',
        data: { name: 'My API key' },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.apiKeys.update('apiKey_1', { name: 'My API key' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/api-keys/apiKey_1',
        data: { name: 'My API key' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.apiKeys.remove('apiKey_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/api-keys/apiKey_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
