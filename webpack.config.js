const path = require('path')

const webpack = require('webpack')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'

const getPlugins = (envName) => {
  const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

  if (isProd) {
    plugins.push(
      new MinifyPlugin()
    )
    if (envName === 'browser') {
      plugins.push(
        new BundleAnalyzerPlugin({ analyzerPort: 9898 })
      )
    }
  }

  return plugins
}

const baseFileName = 'stelace'

const getBaseBundleConfig = (envName) => {
  const isNode = envName === 'node'

  return {
    mode: isProd ? 'production' : 'development',
    context: path.join(__dirname, 'lib'),
    entry: [`./${baseFileName}.js`],
    target: isNode ? 'node' : 'web', // 'web' is webpack default
    output: {
      path: path.join(__dirname, 'dist'),
      libraryTarget: isNode ? 'commonjs2' : 'umd',
      library: 'stelace'
    },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { envName }
        }
      }]
    },
    devtool: isProd ? false : 'source-map',
    plugins: getPlugins(envName),
    node: false, // remove this property for node
    // https://webpack.js.org/configuration/stats/
    stats: process.env.DEBUG_BUILD === 'true' ? 'verbose' : true
  }
}

// Latest browsers
const evergreenBundle = getBaseBundleConfig('evergreen')
evergreenBundle.output.filename = `${baseFileName}.evergreen${isProd ? '.min' : ''}.js`

// Supports legacy browsers like IE 11
const browserBundle = getBaseBundleConfig('browser')
browserBundle.output.filename = `${baseFileName}.browser${isProd ? '.min' : ''}.js`
// Node
const nodeBundle = getBaseBundleConfig('node')
nodeBundle.output.filename = `${baseFileName}.node${isProd ? '.min' : ''}.js`
nodeBundle.target = 'node'
delete nodeBundle.node

module.exports = [
  evergreenBundle,
  browserBundle,
  nodeBundle
]
