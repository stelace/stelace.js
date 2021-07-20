import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.webhooks.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/webhooks',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('list: sends the correct request', (t) => {
  return stelace.webhooks.list({ stelaceVersion: '2019-05-20' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/webhooks',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2019-05-20'
        }
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.webhooks.read('webhook_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/webhooks/webhook_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    name: 'Test webhook',
    targetUrl: 'https://example.com',
    event: 'asset__created',
    active: true
  }

  return stelace.webhooks.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/webhooks',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.webhooks.update('webhook_1', { name: 'Updated webhook' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/webhooks/webhook_1',
        data: { name: 'Updated webhook' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.webhooks.remove('webhook_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/webhooks/webhook_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
