import test from 'blue-tape'

import { clone } from '../lib/utils'

import { getSpyableStelace, getStelaceStub, maxNbResultsPerPage } from '../testUtils'

import Resource from '../lib/Resource'

test('Gets correct API base URL', (t) => {
  const stelace = getSpyableStelace()

  const resource = new Resource(stelace)

  t.is(resource.getBaseURL(), 'https://api.stelace.com')

  stelace.setHost('127.0.0.1', 3000, 'http')
  t.is(resource.getBaseURL(), 'http://127.0.0.1:3000')

  t.end()
})

test('Extracts pagination "results" from response', (t) => {
  const stelace = getSpyableStelace()
  const resource = new Resource(stelace)

  const api = getStelaceStub()
  api.startStub()

  const customAttributes = {
    nbResults: 1,
    nbPages: 1,
    page: 1,
    nbResultsPerPage: 20,
    results: [{
      id: 'attr_wjPjVe1DAs1hP3H2DAO',
      createdDate: '2019-04-04T03:17:55.564Z',
      updatedDate: '2019-04-08T02:17:53.375Z',
      name: 'bluetooth',
      type: 'boolean',
      listValues: null,
      metadata: {
        label: 'Bluetooth'
      },
      platformData: {},
      livemode: false
    }]
  }

  const res = {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: customAttributes
  }

  const baseURL = api.customAttributes.getBaseURL()
  api.stubRequest(`${baseURL}/custom-attributes?nbResultsPerPage=${maxNbResultsPerPage}`, res)

  return api.customAttributes.list()
    .then(ca => {
      t.deepEqual(ca, customAttributes.results)

      // TODO: clean this once we use proper moxios.wait
      // To have proper axios response format with `data` property
      // https://github.com/axios/moxios/blob/v0.4.0/test.js#L127
      const axiosResponse = clone(res)
      axiosResponse.data = axiosResponse.response
      delete axiosResponse.response

      t.deepEqual(resource._responseHandler(axiosResponse), res.response)
    })
    .then(() => api.stopStub())
    .catch(err => {
      api.stopStub()
      throw err
    })
})

test('Passes plain array response as is', (t) => {
  const stelace = getSpyableStelace()
  const resource = new Resource(stelace)

  const api = getStelaceStub()
  api.startStub()

  // Some resources are not paginated
  const categories = [{
    id: 'ctgy_ejQQps1I3a1gJYz2I3a',
    name: 'Cars',
    parentId: null,
    metadata: {},
    platformData: {},
    createdDate: '2018-04-14T08:53:59.076Z',
    updatedDate: '2018-04-14T08:53:59.076Z',
    livemode: false
  }, {
    id: 'ctgy_naEQps1I3a1gJYz2I3a',
    name: 'Vans',
    parentId: null,
    metadata: {},
    platformData: {},
    createdDate: '2018-04-15T08:53:59.076Z',
    updatedDate: '2018-04-15T08:53:59.076Z',
    livemode: false
  }]

  const res = {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: categories
  }

  const baseURL = api.categories.getBaseURL()
  api.stubRequest(`${baseURL}/categories?nbResultsPerPage=${maxNbResultsPerPage}`, res)

  return api.categories.list()
    .then(cat => {
      t.deepEqual(cat, categories)

      // TODO: clean this once we use proper moxios.wait
      // To have proper axios response format with `data` property
      // https://github.com/axios/moxios/blob/v0.4.0/test.js#L127
      const axiosResponse = clone(res)
      axiosResponse.data = axiosResponse.response
      delete axiosResponse.response

      t.deepEqual(resource._responseHandler(axiosResponse), res.response)
    })
    .then(() => api.stopStub())
    .catch(err => {
      api.stopStub()
      throw err
    })
})

test('Adds basic methods for Resource instances', (t) => {
  const stelace = getSpyableStelace()

  class ResourceExample extends Resource {}

  const resource1 = new ResourceExample(stelace)
  t.notOk(resource1.list)
  t.notOk(resource1.read)
  t.notOk(resource1.create)
  t.notOk(resource1.update)
  t.notOk(resource1.remove)

  Resource.addBasicMethods(ResourceExample, { path: '/resource', includeBasic: ['list', 'read', 'create'] })

  const resource2 = new ResourceExample(stelace)
  t.true(typeof resource2.list === 'function')
  t.true(typeof resource2.read === 'function')
  t.true(typeof resource2.create === 'function')
  t.notOk(resource2.update)
  t.notOk(resource2.remove)

  t.end()
})
