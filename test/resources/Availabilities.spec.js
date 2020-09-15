import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('getGraph: sends the correct request', (t) => {
  return stelace.availabilities.getGraph({ assetId: 'asset_1' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/availabilities/graph',
        data: {},
        queryParams: {
          assetId: 'asset_1'
        },
        headers: {}
      })
    })
})

test('list: sends the correct request', (t) => {
  return stelace.availabilities.list({ assetId: 'asset_1' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/availabilities',
        data: {},
        queryParams: {
          assetId: 'asset_1',
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    assetId: 'asset_1',
    startDate: '2018-01-01T00:00:00.000Z',
    endDate: '2018-01-10T00:00:00.000Z',
    quantity: 1
  }

  return stelace.availabilities.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/availabilities',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  const data = {
    startDate: '2018-01-01T00:00:00.000Z',
    endDate: '2018-01-10T00:00:00.000Z',
    quantity: 2
  }

  return stelace.availabilities.update('availability_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/availabilities/availability_1',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.availabilities.remove('availability_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/availabilities/availability_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
