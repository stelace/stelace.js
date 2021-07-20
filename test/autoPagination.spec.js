import test from 'blue-tape'
import _ from 'lodash'

import { getStelaceStub, maxNbResultsPerPage } from '../testUtils'
import qs from 'querystring'

const nbResults = 1000 // total number of results
const maxAutopaginationLimit = 10000

const getUrl = (urlPath, params) => `${urlPath}?${qs.stringify(params)}`
const getRequestId = num => `requestId${num}`

const initNonPaginationStubs = ({ stelace, endpointUrl, getObject, nbResults }) => {
  const url = getUrl(endpointUrl, { nbResultsPerPage: maxNbResultsPerPage })

  stelace.stubRequest(url, {
    status: 200,
    headers: {
      'x-request-id': getRequestId(1)
    },
    response: _.range(1, nbResults + 1).map(getObject) // returns all objects at once
  })
}

const initOffsetPaginationStubs = ({ stelace, endpointUrl, params, getObject, nbResults, nbResultsPerPage }) => {
  const nums = _.range(1, nbResults + 1)
  const numsByPage = _.chunk(nums, nbResultsPerPage)

  numsByPage.forEach((nums, p) => {
    const page = p + 1
    const urlParams = Object.assign({}, params)
    if (page !== 1) urlParams.page = page
    if (!urlParams.nbResultsPerPage) urlParams.nbResultsPerPage = nbResultsPerPage

    const url = getUrl(endpointUrl, urlParams)

    stelace.stubRequest(url, {
      status: 200,
      headers: {
        'x-request-id': getRequestId(page)
      },
      response: {
        nbResults,
        nbPages: numsByPage.length,
        page,
        nbResultsPerPage,
        results: nums.map(getObject),
      }
    })
  })
}

const initCursorPaginationStubs = ({ stelace, endpointUrl, params, getObject, nbResults, nbResultsPerPage }) => {
  const nums = _.range(1, nbResults + 1)
  const numsByPage = _.chunk(nums, nbResultsPerPage)
  const getCursor = (page) => `cursor${page}`

  numsByPage.forEach((nums, p) => {
    const page = p + 1
    const urlParams = Object.assign({}, params)

    const cursor = getCursor(page)
    const previousCursor = getCursor(page - 1)
    if (page !== 1) urlParams.startingAfter = previousCursor
    if (!urlParams.nbResultsPerPage) urlParams.nbResultsPerPage = nbResultsPerPage

    const url = getUrl(endpointUrl, urlParams)

    stelace.stubRequest(url, {
      status: 200,
      headers: {
        'x-request-id': getRequestId(page)
      },
      response: {
        startCursor: cursor,
        endCursor: cursor,
        hasPreviousPage: page !== 1,
        hasNextPage: page !== numsByPage.length,
        nbResultsPerPage,
        results: nums.map(getObject),
      }
    })
  })
}

test('async iterator: handles non-paginated endpoints', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.roles.getBaseURL()
  const endpointUrl = `${baseURL}/roles`

  const getRole = (num) => ({ id: `role_${num}`, name: `Role ${num}` })
  initNonPaginationStubs({ stelace, endpointUrl, getObject: getRole, nbResults })

  const expectedResults = _.range(1, nbResults + 1).map(getRole)

  stelace.startStub()
  initNonPaginationStubs({ stelace, endpointUrl, getObject: getRole, nbResults })

  const roles = []
  for await (const role of stelace.roles.list()) {
    roles.push(role)
    // no break to iterate over all results
  }

  t.deepEqual(roles, expectedResults)

  stelace.stopStub()
})

test('autoPagingToArray: handles non-paginated endpoints', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.roles.getBaseURL()
  const endpointUrl = `${baseURL}/roles`

  const getRole = (num) => ({ id: `role_${num}`, name: `Role ${num}` })
  initNonPaginationStubs({ stelace, endpointUrl, getObject: getRole, nbResults })

  const expectedResults = _.range(1, nbResults + 1).map(getRole)

  return stelace.roles.list().autoPagingToArray({ limit: maxAutopaginationLimit })
    .then(roles => {
      t.deepEqual(roles, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('async iterator: autopaginate offset pagination endpoint', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const nbResultsPerPage = 1 // get objects one by one
  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    nbResultsPerPage,
    orderBy: 'createdDate',
    order: 'asc',
  }

  initOffsetPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  const assets = []
  for await (const asset of stelace.assets.list(params)) {
    assets.push(asset)
    // no break to iterate over all results
  }

  t.deepEqual(assets, expectedResults)

  stelace.stopStub()
})

test('async iterator: autopaginate offset pagination endpoint without nbResultsPerPage', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    // missing nbResultsPerPage
    orderBy: 'createdDate',
    order: 'asc',
  }

  initOffsetPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  const assets = []
  for await (const asset of stelace.assets.list(params)) {
    assets.push(asset)
    // no break to iterate over all results
  }

  t.deepEqual(assets, expectedResults)

  stelace.stopStub()
})

test('autoPagingToArray: autopaginate offset pagination endpoint', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const nbResultsPerPage = 1 // get objects one by one
  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    nbResultsPerPage,
    orderBy: 'createdDate',
    order: 'asc',
  }

  initOffsetPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  return stelace.assets.list(params).autoPagingToArray({ limit: maxAutopaginationLimit })
    .then(assets => {
      t.deepEqual(assets, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('autoPagingToArray: autopaginate offset pagination endpoint without nbResultsPerPage', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    // missing nbResultsPerPage
    orderBy: 'createdDate',
    order: 'asc',
  }

  initOffsetPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  return stelace.assets.list(params).autoPagingToArray({ limit: maxAutopaginationLimit })
    .then(assets => {
      t.deepEqual(assets, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('async iterator: autopaginate cursor pagination endpoint', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const nbResultsPerPage = 1 // get objects one by one
  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    nbResultsPerPage,
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  const assets = []
  for await (const asset of stelace.assets.list(params)) {
    assets.push(asset)
    // no break to iterate over all results
  }

  t.deepEqual(assets, expectedResults)

  stelace.stopStub()
})

test('async iterator: autopaginate cursor pagination endpoint without nbResultsPerPage', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    // missing nbResultsPerPage
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  const assets = []
  for await (const asset of stelace.assets.list(params)) {
    assets.push(asset)
    // no break to iterate over all results
  }

  t.deepEqual(assets, expectedResults)

  stelace.stopStub()
})

test('autoPagingToArray: autopaginate cursor pagination endpoint', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const nbResultsPerPage = 1 // get objects one by one
  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    nbResultsPerPage,
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  return stelace.assets.list(params).autoPagingToArray({ limit: maxAutopaginationLimit })
    .then(assets => {
      t.deepEqual(assets, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('autoPagingToArray: autopaginate cursor pagination endpoint without nbResultsPerPage', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    // missing nbResultsPerPage
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const expectedResults = _.range(1, nbResults + 1).map(getAsset)

  return stelace.assets.list(params).autoPagingToArray({ limit: maxAutopaginationLimit })
    .then(assets => {
      t.deepEqual(assets, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('async iterator: stops when there is a break', async (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const limit = 10
  let i = limit

  const expectedResults = _.range(1, limit + 1).map(getAsset)

  const assets = []
  for await (const asset of stelace.assets.list(params)) {
    assets.push(asset)

    i -= 1
    if (i === 0) break
  }

  t.deepEqual(assets, expectedResults)

  stelace.stopStub()
})

test('autoPagingToArray: stops when the limit is reached', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  const endpointUrl = `${baseURL}/assets`

  const getAsset = (num) => ({ id: `asset_${num}`, name: `Asset ${num}` })
  const params = {
    orderBy: 'createdDate',
    order: 'asc',
  }

  initCursorPaginationStubs({
    stelace,
    endpointUrl,
    params,
    getObject: getAsset,
    nbResults,
    nbResultsPerPage: maxNbResultsPerPage,
  })

  const limit = 10
  const expectedResults = _.range(1, limit + 1).map(getAsset)

  return stelace.assets.list(params).autoPagingToArray({ limit })
    .then(assets => {
      t.deepEqual(assets, expectedResults)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})
