import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('change: sends the correct request', (t) => {
  return stelace.password.change({ currentPassword: 'secretPassword', newPassword: 'newSecretPassword' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/password/change',
        data: { currentPassword: 'secretPassword', newPassword: 'newSecretPassword' },
        queryParams: {},
        headers: {}
      })
    })
})

test('resetRequest: sends the correct request', (t) => {
  return stelace.password.resetRequest({ username: 'foo' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/password/reset/request',
        data: { username: 'foo' },
        queryParams: {},
        headers: {}
      })
    })
})

test('resetConfirm: sends the correct request', (t) => {
  return stelace.password.resetConfirm({ resetToken: 'resetTokenExample', newPassword: 'newSecretPassword' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/password/reset/confirm',
        data: { resetToken: 'resetTokenExample', newPassword: 'newSecretPassword' },
        queryParams: {},
        headers: {}
      })
    })
})
