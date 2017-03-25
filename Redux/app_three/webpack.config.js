var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var autoprefixer = require('autoprefixer')
var pxtorem = require('postcss-pxtorem')

var DEBUG = process.env.NODE_ENV === `debug`
var PRODUCTION = process.env.NODE_ENV === `production`
var DEVELOP = process.env.NODE_ENV === `develop`
var TEST = process.env.NODE_ENV === `test`
var targetPath = PRODUCTION ? '../../../php_release/h5/www' : 'dist'

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: DEVELOP ? [
    'webpack-dev-server/client?http://0.0.0.0:8000',
    'webpack/hot/only-dev-server',
    './js/client.js'
  ] : ['./js/client.js'],
  output: {
    path: path.join(__dirname, targetPath),
    publicPath: DEBUG ? '' : '/',
    chunkFilename: 'js/[id].chunk.js?[hash]',
    filename: 'js/client.min.js'
  },
  resolve: {
    root: [
      path.resolve('./src/assets'),
      path.resolve('./src/js')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: DEVELOP ? ['react', 'es2015', 'stage-0', 'react-hmre'] : ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties', 'transform-runtime', 'add-module-exports', ['import', { 'style': 'css', 'libraryName': 'antd-mobile' }]]
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader!source-map!postcss-loader' },
      { test: /\.component.scss$/, loader: 'style-loader!css-loader!source-map!sass-loader!postcss-loader' },
      { test: /\.scss$/, exclude: /\.component.scss$/, loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'source-map', 'sass-loader']) },
      { test: /\.(jpg|png|svg)$/, loader: 'url-loader?limit=1&name=[path][name].[ext]' },
      { test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, loader: 'url?prefix=font/&limit=10000' }
    ],
    postLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['es3ify-loader', 'source-map-loader']
      }
    ]
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    }),
    pxtorem({ rootValue: 75, propWhiteList: [] })
  ],
  plugins: PRODUCTION || TEST ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({names: ['common'], filename: 'js/[name].js'}),
    new ExtractTextPlugin('assets/css/main.css', {
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: 'assets/index.html'
    })
  ] : [
    new webpack.optimize.CommonsChunkPlugin({names: ['common'], filename: 'js/[name].js'}),
    new ExtractTextPlugin('assets/css/main.css', {
      disable: false,
      allChunks: false
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: 'assets/index.html'
    })
  ]
}
