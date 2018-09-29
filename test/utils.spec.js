import test from 'blue-tape'

import {
  isApiKey,
  asCallback,
  interpolatePath
} from '../lib/utils'

test('Checks if an API key has the right format', (t) => {
  t.true(isApiKey('sk_test_wakWA41rBTUXs1Y5oNRjeY5o'))
  t.false(isApiKey('sk_test_wakWA41rBTUXs1Y5oNRjeY5od')) // too long
  t.false(isApiKey('123456789'))
  t.false(isApiKey(123))
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
