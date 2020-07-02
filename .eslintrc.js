module.exports = {
  parser: 'babel-eslint',
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  globals: {
    __VERSION__: true
  },

  rules: {
    'comma-dangle': 'off'
  }
}
