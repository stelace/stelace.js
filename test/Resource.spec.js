import test from 'blue-tape'

import { getSpyableStelace } from '../testUtils'
import Resource from '../lib/Resource'

test('Gets correct API base URL', (t) => {
  const stelace = getSpyableStelace()

  const resource = new Resource(stelace)

  t.is(resource.getBaseURL(), 'https://api.stelace.com')

  stelace.setHost('127.0.0.1', 3000, 'http')
  t.is(resource.getBaseURL(), 'http://127.0.0.1:3000')

  t.end()
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
