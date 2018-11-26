import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('preview: sends the correct request', (t) => {
  return stelace.transactions.preview({ bookings: ['bkg_1'] })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transactions/preview',
        data: { bookings: ['bkg_1'] },
        queryParams: {},
        headers: {}
      })
    })
})

test('list: sends the correct request', (t) => {
  return stelace.transactions.list({ page: 2, nbResultsPerPage: 10 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/transactions',
        data: {},
        queryParams: { page: 2, nbResultsPerPage: 10 },
        headers: {}
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.transactions.read('txn_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/transactions/txn_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.transactions.create({ bookings: ['bkg_1'] })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transactions',
        data: { bookings: ['bkg_1'] },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.transactions.update('txn_1', { metadata: { customData: true } })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/transactions/txn_1',
        data: { metadata: { customData: true } },
        queryParams: {},
        headers: {}
      })
    })
})
