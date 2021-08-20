import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.roles.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/roles',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('[2019-05-20] list: sends the correct request', (t) => {
  return stelace.roles.list({ stelaceVersion: '2019-05-20' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/roles',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2019-05-20'
        }
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.roles.read('role_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/roles/role_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.roles.create({ name: 'Developer', value: 'dev' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/roles',
        data: { name: 'Developer', value: 'dev' },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.roles.update('role_1', { name: 'Custom developer' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/roles/role_1',
        data: { name: 'Custom developer' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.roles.remove('role_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/roles/role_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
