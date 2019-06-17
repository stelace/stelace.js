import test from 'blue-tape'

import {
  isApiKey,
  isSecretApiKey,
  asCallback,
  interpolatePath,
  decodeJwtToken,

  clone
} from '../lib/utils'

test('Checks if an API key has the right format', (t) => {
  t.true(isApiKey('seck_test_wakWA41rBTUXs1Y5oNRjeY5o'))
  t.true(isApiKey('sk_test_wakWA41rBTUXs1Y5oNRjeY5o')) // DEPRECATED: old format
  t.true(isApiKey('custom_live_wakWA41rBTUXs1Y5oNRjeY5o'))
  t.false(isApiKey('seck_test_wakWA41rBTUXs1Y5oNRje')) // too short
  t.false(isApiKey('k_test_wakkWA41rBTUXs1Y5oNRjeYo')) // too short prefix
  t.false(isApiKey('123456789'))
  t.false(isApiKey(123))
  t.false(isApiKey())
  t.end()
})

test('Checks if an API key is a secret key', (t) => {
  t.true(isSecretApiKey('seck_test_wakWA41rBTUXs1Y5oNRjeY5o'))
  t.true(isSecretApiKey('sk_test_wakWA41rBTUXs1Y5oNRjeY5o')) // DEPRECATED: old format
  t.false(isSecretApiKey('pubk_test_wakWA41rBTUXs1Y5oNRjeY5o'))
  t.false(isSecretApiKey('pk_test_wakWA41rBTUXs1Y5oNRjeY5o')) // DEPRECATED: old format
  t.end()
})

test('Can be called as a promise', (t) => {
  const promise = Promise.resolve(10)

  const mixPromiseCallback = asCallback(promise)

  return mixPromiseCallback
    .then(res => t.is(res, 10))
})

test('Can be called with a callback', (t) => {
  const promise = Promise.resolve(10)

  const callback = (err, res) => {
    if (err) t.notOk(err)
    else t.is(res, 10)

    t.end()
  }

  t.plan(1)

  asCallback(promise, callback)
})

test('Can replace tokens by their value', (t) => {
  t.is(interpolatePath('/categories/:id', { id: 'ctgy_123' }), '/categories/ctgy_123')
  t.is(interpolatePath('/url/:id/path/:id2', { id: '1', id2: '2' }), '/url/1/path/2')
  t.end()
})

test('Decodes JWT token', (t) => {
  const encodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfV0hsZlFwczFJM2ExZ0pZejJJM2EiLCJyb2xlc' +
    'yI6WyJhZG1pbiJdLCJsb2dnZWRBdCI6MTUzODIyOTU3MiwiaWF0IjoxNTM4MjI5NTcyLCJleHAiOjE1MzgyMzMxNzJ9.97by8xQwhhIFKVUPNkOhl' +
    'nw22EpzXW6oiiKOoChW7Lk'

  t.deepEqual(decodeJwtToken(encodedToken), {
    userId: 'usr_WHlfQps1I3a1gJYz2I3a',
    roles: [
      'admin'
    ],
    loggedAt: 1538229572,
    iat: 1538229572,
    exp: 1538233172
  })
  t.end()
})

test('Properly clones array or object', (t) => {
  const arr = [{ id: 1 }, { id: '2' }]
  t.deepEqual(arr, clone(arr))
  t.not(arr, clone(arr))

  const obj = { id: '3', name: 'test', metadata: { is: true } }
  t.deepEqual(obj, clone(obj))
  t.not(obj, clone(obj))

  const fn = _ => _ // obj.length === 1, but return untouched
  t.is(fn, clone(fn))

  const str = 'test' // untouched too
  t.is(str, clone(str))

  t.end()
})
