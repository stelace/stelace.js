import memoryLocalStorage from 'localstorage-memory'

const generateKey = (namespace) => `${namespace}-authtoken`

export const createDefaultTokenStore = () => {
  const namespace = 'stl'

  const localStorage = (typeof window === 'object' && window.localStorage) || memoryLocalStorage

  return {
    getTokens () {
      const key = generateKey(namespace)

      const rawValue = localStorage.getItem(key)
      return JSON.parse(rawValue)
    },

    setTokens (tokens) {
      if (!tokens || typeof tokens !== 'object') {
        throw new Error('Expected object as tokens value')
      }

      const key = generateKey(namespace)
      localStorage.setItem(key, JSON.stringify(tokens))
    },

    removeTokens () {
      const key = generateKey(namespace)
      localStorage.removeItem(key)
    }
  }
}
