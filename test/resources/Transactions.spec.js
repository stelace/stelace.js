import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

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
  return stelace.transactions.read('transaction_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/transactions/transaction_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('preview: sends the correct request', (t) => {
  return stelace.transactions.preview({ assetId: 'asset_1', quantity: 2 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transactions/preview',
        data: { assetId: 'asset_1', quantity: 2 },
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.transactions.create({ assetId: 'asset_1', quantity: 2 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transactions',
        data: { assetId: 'asset_1', quantity: 2 },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.transactions.update('transaction_1', { status: 'customStatus' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/transactions/transaction_1',
        data: { status: 'customStatus' },
        queryParams: {},
        headers: {}
      })
    })
})

test('process: sends the correct request', (t) => {
  return stelace.transactions.createTransition('transaction_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transactions/transaction_1/transitions',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
