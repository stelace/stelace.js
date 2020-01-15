// Use this file rather than .babelrc for dynamic config (babel 7)

// https://babeljs.io/docs/en/babel-preset-env
const defaultBabelPresetEnvConfig = {
  modules: false, // keep ES6 modules, webpack will take care of conversion if necessary
  useBuiltIns: 'usage',
  corejs: 3,
  debug: process.env.DEBUG_BUILD === 'true'
}

// Modern browser bundle, for minimal size
const evergreenBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  targets: '> 0.5%, not ie 11, not op_mini all, not android <= 5, not samsung <= 5'
})

const defaultBrowserTargets = 'last 2 versions, Firefox ESR, > 0.2%'

// Supports most browsers used globally, with heavier bundle
const browserBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  // This currently includes IE11 and popular but feature-limited browsers such as Opera Mini
  targets: defaultBrowserTargets
})

// ES6 modules, but content is still transpiled to ES5 for wide browser support
const modulesBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  // no targets
  targets: defaultBrowserTargets,
})

// Node
const nodeBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  targets: 'node >= 6.17' // EOL: 2019-04-30
})

// Tests need to transform modules
const testBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  targets: `${nodeBabelPresetEnvConfig.targets}, ${browserBabelPresetEnvConfig.targets}`,
  modules: 'commonjs'
})

const plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  'lodash', // https://github.com/lodash/babel-plugin-lodash
  ['@babel/plugin-transform-runtime',
    {
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "version": "7.8.3"
    }
  ],
  ['inline-replace-variables', {
    // Inject version number into code
    '__VERSION__': require('./package.json').version
  }]
]

function getBabelConfig (envName) {
  let preset

  if (envName === 'evergreen') preset = evergreenBabelPresetEnvConfig
  else if (envName === 'browser') preset = browserBabelPresetEnvConfig
  else if (envName === 'modules') preset = modulesBabelPresetEnvConfig
  else if (envName === 'node') preset = nodeBabelPresetEnvConfig
  else if (envName === 'test') preset = testBabelPresetEnvConfig

  return {
    plugins,
    presets: [
      ['@babel/preset-env', preset]
    ]
  }
}

module.exports = function (api) {
  return getBabelConfig(api.env())
}
