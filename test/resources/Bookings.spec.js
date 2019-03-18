import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.bookings.list({ page: 2, nbResultsPerPage: 10 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/bookings',
        data: {},
        queryParams: { page: 2, nbResultsPerPage: 10 },
        headers: {}
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.bookings.read('booking_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/bookings/booking_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.bookings.create({ assetId: 'asset_1', quantity: 2 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/bookings',
        data: { assetId: 'asset_1', quantity: 2 },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.bookings.update('booking_1', { status: 'customStatus' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/bookings/booking_1',
        data: { status: 'customStatus' },
        queryParams: {},
        headers: {}
      })
    })
})

test('process: sends the correct request', (t) => {
  return stelace.bookings.createTransition('booking_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/bookings/booking_1/transitions',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
