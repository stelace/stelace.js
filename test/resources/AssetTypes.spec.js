import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.assetTypes.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/asset-types',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('[2019-05-20] list: sends the correct request', (t) => {
  return stelace.assetTypes.list({ stelaceVersion: '2019-05-20' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/asset-types',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2019-05-20'
        }
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.assetTypes.read('assetType_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/asset-types/assetType_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.assetTypes.create({ name: 'New asset type' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/asset-types',
        data: { name: 'New asset type' },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.assetTypes.update('assetType_1', { name: 'Updated asset type' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/asset-types/assetType_1',
        data: { name: 'Updated asset type' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.assetTypes.remove('assetType_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/asset-types/assetType_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
