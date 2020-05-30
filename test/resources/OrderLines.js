import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('read: sends the correct request', (t) => {
  return stelace.orderLines.read('orderLine_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/order-lines/orderLine_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    orderId: 'order_1',
    transactionId: 'transaction_1'
  }

  return stelace.orderLines.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/order-lines',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  const data = { payerAmount: 5000 }

  return stelace.orderLines.update('orderLine_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/order-lines/orderLine_1',
        data: data,
        queryParams: {},
        headers: {}
      })
    })
})
