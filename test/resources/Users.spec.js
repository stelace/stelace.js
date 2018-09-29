import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('checkAvailability: sends the correct request', (t) => {
  return stelace.users.checkAvailability({ username: 'foo@bar.com' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users/check-availability',
        data: {},
        queryParams: { username: 'foo@bar.com' },
        headers: {}
      })
    })
})

test('list: sends the correct request', (t) => {
  return stelace.users.list({ page: 2, nbResultsPerPage: 10 })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: { page: 2, nbResultsPerPage: 10 },
        headers: {}
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.users.read('user_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users/user_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  return stelace.users.create({ username: 'Foo', password: 'secretPassword' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/users',
        data: { username: 'Foo', password: 'secretPassword' },
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.users.update('user_1', { displayName: 'FooBar' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/users/user_1',
        data: { displayName: 'FooBar' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.users.remove('user_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/users/user_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})
