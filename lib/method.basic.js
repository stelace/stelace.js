export default function getBasicMethods (path, stelaceMethod) {
  return {
    list: stelaceMethod({
      path,
      method: 'GET',
      isList: true
    }),

    read: stelaceMethod({
      path: `${path}/:id`,
      method: 'GET',
      urlParams: ['id']
    }),

    create: stelaceMethod({
      path,
      method: 'POST'
    }),

    update: stelaceMethod({
      path: `${path}/:id`,
      method: 'PATCH',
      urlParams: ['id']
    }),

    remove: stelaceMethod({
      path: `${path}/:id`,
      method: 'DELETE',
      urlParams: ['id']
    })
  }
}
