import Resource from '../Resource'

const method = Resource.method

export default class Assessments extends Resource {}

Resource.addBasicMethods(Assessments, {
  path: '/assessments',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

Assessments.prototype.sign = method({
  path: '/assessments/:id/signatures',
  method: 'POST',
  urlParams: ['id']
})
