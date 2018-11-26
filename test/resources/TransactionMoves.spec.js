import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('read: sends the correct request', (t) => {
  return stelace.transactionMoves.read('txnl_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/transaction_moves/txnl_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const data = {
    transactionId: 'txn_1',
    bookingId: 'bkg_1',
    senderId: 'usr_1',
    senderAmount: 100,
    platformAmount: 10,
    currency: 'USD'
  }

  return stelace.transactionMoves.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/transaction_moves',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  const data = {
    real: {
      senderAmount: 80,
      platformAmount: 8,
      currency: 'EUR'
    }
  }

  return stelace.transactionMoves.update('txnl_1', data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/transaction_moves/txnl_1',
        data,
        queryParams: {},
        headers: {}
      })
    })
})
