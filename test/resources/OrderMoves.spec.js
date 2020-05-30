import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('read: sends the correct request', (t) => {
  return stelace.orderMoves.read('orderMove_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/order-moves/orderMove_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    orderId: 'order_1',
    transactionId: 'transaction_1',
    payerId: 'user_1',
    payerAmount: 10000,
    currency: 'USD'
  }

  return stelace.orderMoves.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/order-moves',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  const data = { metadata: { someVar: true } }

  return stelace.orderMoves.update('orderMove_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/order-moves/orderMove_1',
        data: data,
        queryParams: {},
        headers: {}
      })
    })
})
