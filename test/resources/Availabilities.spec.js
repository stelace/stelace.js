import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.availabilities.list('asset_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/assets/asset_1/availabilities',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    startDate: '2018-01-01T00:00:00.000Z',
    endDate: '2018-01-10T00:00:00.000Z',
    quantity: 1
  }

  return stelace.availabilities.create('asset_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/assets/asset_1/availabilities',
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

  return stelace.availabilities.update('asset_1', 'availability_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/assets/asset_1/availabilities/availability_1',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.availabilities.remove('asset_1', 'availability_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/assets/asset_1/availabilities/availability_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
