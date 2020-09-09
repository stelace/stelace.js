import { asCallback } from './utils'
import makeRequest from './makeRequest'

export default function makeAutoPaginationMethods (self, requestArgs, spec, firstPagePromise) {
  const promiseCache = { currentPromise: null }
  let listPromise = firstPagePromise
  let i = 0

  function iterate (response) {
    const { paginationMeta } = response

    const isPaginated = Boolean(paginationMeta)

    if (i < response.length) {
      const value = response[i]
      i += 1
      return { value, done: false }
    } else if (isPaginated) {
      const isOffsetPaginated = typeof paginationMeta.nbPages !== 'undefined'
      const isCursorPaginated = typeof paginationMeta.hasNextPage !== 'undefined'

      const { page, nbPages, hasNextPage } = paginationMeta

      let fetchNextPage
      let newPageParams

      if (isOffsetPaginated) {
        fetchNextPage = page < nbPages
        newPageParams = { page: page + 1 }
      } else if (isCursorPaginated) {
        fetchNextPage = hasNextPage
        newPageParams = { startingAfter: paginationMeta.endCursor }
      }

      if (fetchNextPage) {
        // reset counter, request next page, and recurse
        i = 0
        listPromise = makeRequest(self, requestArgs, spec, newPageParams)
        return listPromise.then(iterate)
      }
    }

    return { value: undefined, done: true }
  }

  function asyncIteratorNext () {
    return memoizedPromise(promiseCache, (resolve, reject) => {
      return listPromise
        .then(iterate)
        .then(resolve)
        .catch(reject)
    })
  }

  const autoPagingToArray = makeAutoPagingToArray(asyncIteratorNext)

  const autoPaginationMethods = {
    autoPagingToArray,

    // Async iterator functions
    next: asyncIteratorNext,
    return: () => {
      // This is required for `break`
      return {}
    },
    [getAsyncIteratorSymbol()]: () => {
      return autoPaginationMethods
    },
  }
  return autoPaginationMethods
}

// /////// //
// HELPERS //
// /////// //

function getAsyncIteratorSymbol () {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator) {
    return Symbol.asyncIterator
  }
  // Follow the convention from libraries like iterall: https://github.com/leebyron/iterall#asynciterator-1
  return '@@asyncIterator'
}

/**
 * If a user calls `.next()` multiple times in parallel,
 * return the same result until something has resolved
 * to prevent page-turning race conditions.
 */
function memoizedPromise (promiseCache, cb) {
  if (promiseCache.currentPromise) {
    return promiseCache.currentPromise
  }
  promiseCache.currentPromise = new Promise(cb).then((ret) => {
    promiseCache.currentPromise = undefined
    return ret
  })
  return promiseCache.currentPromise
}

function makeAutoPagingToArray (asyncIteratorNext) {
  return function autoPagingToArray (opts, onDone) {
    const limit = opts && opts.limit
    if (!limit) {
      throw new Error(
        'You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({ limit: 1000 });`.'
      )
    }
    if (limit > 10000) {
      throw new Error(
        'You cannot specify a limit of more than 10,000 objects to fetch in `autoPagingToArray`.'
      )
    }
    const promise = new Promise((resolve, reject) => {
      const objects = []
      wrapAsyncIteratorWithCallback(asyncIteratorNext, (obj) => {
        return new Promise((resolve) => {
          objects.push(obj)
          const keepFetching = objects.length < limit
          resolve(keepFetching)
        })
      })
        .then(() => resolve(objects))
        .catch(reject)
    })
    return asCallback(promise, onDone)
  }
}

function wrapAsyncIteratorWithCallback (asyncIteratorNext, onObject) {
  return new Promise((resolve, reject) => {
    function handleIteration (iterResult) {
      if (iterResult.done) return resolve()

      const obj = iterResult.value
      return onObject(obj)
        .then((shouldContinue) => {
          if (shouldContinue === false) return handleIteration({ done: true })
          else return asyncIteratorNext().then(handleIteration)
        })
    }

    asyncIteratorNext()
      .then(handleIteration)
      .catch(reject)
  })
}
