import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.categories.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('[2019-05-20] list: sends the correct request', (t) => {
  return stelace.categories.list({ stelaceVersion: '2019-05-20' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2019-05-20'
        }
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.categories.read('category_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories/category_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.categories.create({ name: 'Test category' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/categories',
        data: { name: 'Test category' },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.categories.update('category_1', { name: 'Test category' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/categories/category_1',
        data: { name: 'Test category' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.categories.remove('category_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/categories/category_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
