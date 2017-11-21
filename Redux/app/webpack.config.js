var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HappyPack = require('happypack')
const os = require('os')
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
var UglifyJsParallelPlugin = require('webpack-uglify-parallel')

var autoprefixer = require('autoprefixer')
var pxtorem = require('postcss-pxtorem')
var DEBUG = process.env.NODE_ENV === `debug`
var PRODUCTION = process.env.NODE_ENV === `production`
var DEVELOP = process.env.NODE_ENV === `develop`
var TEST = process.env.NODE_ENV === `test`
const postcssOpts = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    }),
    pxtorem({ rootValue: 75, propWhiteList: [] })
  ]
}
module.exports = {
  cache: true,
  devtool: DEVELOP ? 'cheap-module-eval-source-map' : false,
  context: path.join(__dirname, 'src'),
  entry: DEVELOP ? [
    'webpack-dev-server/client?http://0.0.0.0:8000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './js/client.js'
  ] : ['./js/client.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: DEBUG ? '' : '/',
    chunkFilename: 'js/[id].chunk.js?[hash]',
    filename: 'js/client.min.js'
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules'), path.join(__dirname, 'src/assets'), path.join(__dirname, 'src/js')],
    extensions: ['.web.js', '.jsx', '.js', '.json']
  },
  module: {
    // noParse: function (content) {
    //   return /html2canvas|lodash/.test(content)
    // },
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-runtime',
            'react-html-attrs',
            'transform-decorators-legacy',
            'transform-class-properties',
            'add-module-exports',
            // 'transform-object-assign',
            ['import', {libraryName: 'antd-mobile'}]],
          comments: false
        }
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sprite-loader' }, { loader: 'postcss-loader', options: postcssOpts }]
      },
      {
        test: /\.component.scss$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sprite-loader' }, { loader: 'postcss-loader', options: postcssOpts }, 'sass-loader']
      },
      {
        test: /\.scss$/,
        exclude: /\.component.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader', options: {minimize: true}}, { loader: 'postcss-loader', options: postcssOpts }, 'sass-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{loader: 'css-loader', options: {minimize: true}}, { loader: 'postcss-loader', options: postcssOpts }, {loader: 'less-loader'}]
        })
      },
      {
        test: /nolimit\.(html|jpe?g|gif|png|ttf|woff2|woff|eot|mp3|ogg|wma?)$/,
        loader: 'file-loader?name=[path][name].[ext]?[hash]'
      },
      {
        test: /\.(html|jpe?g|gif|png|ttf|woff2|woff|eot|mp3|ogg|wma?)$/,
        exclude: /nolimit\.(html|jpe?g|gif|png|ttf|woff2|woff|eot|mp3|ogg|wma?)$/,
        loader: 'url-loader?limit=8192&name=[path][name].[ext]?[hash]'
      },
      {
        test: /\.(svg)$/i,
        use: [
          'svg-sprite-loader',
          'svgo-loader'
        ],
        include: [
          require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
          path.join(__dirname, 'src/assets/svg') // 自己私人的 svg 存放目录
        ]
      }
    ]
  },
  externals: {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'pg': 'pg/native'
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({names: ['common'], filename: 'js/[name].js'}),
    new ExtractTextPlugin({
      filename: 'assets/css/main.css',
      disable: DEVELOP,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      vendor: DEVELOP ? '' : `/dll/vendor.js?${Date.now()}`,
      template: 'index.template.ejs',
      inject: 'body'
    })
  ].concat(PRODUCTION || TEST ? [
    new HappyPack({
      id: 'js',
      threadPool: happThreadPool,
      loaders: [ 'babel-loader' ]
    }),
    new HappyPack({
      id: 'svg',
      threadPool: happThreadPool,
      loaders: [ 'svg-sprite-loader', 'svgo-loader', 'url-loader' ]
    }),
    new HappyPack({
      id: 'styles',
      threadPool: happThreadPool,
      loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/vendor-manifest.json')
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: true,
        workers: os.cpus().length - 1
      },
      beautify: false,
      minimize: true,
      sourceMap: false,
      comments: false
    })
    // new UglifyJsParallelPlugin({
    //   workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
    //   sourceMap: false,
    //   minimize: true,
    //   compress: {
    //     drop_debugger: true,
    //     warnings: false,
    //     drop_console: true
    //   }
    // })
    // new ParallelUglifyPlugin({
    //   cacheDir: './cache',
    //   uglifyJS: {
    //     output: {
    //       comments: false
    //     },
    //     compress: {
    //       warnings: false
    //     }
    //   }
    // })
    // new BundleAnalyzerPlugin(),
  ] : [
    new webpack.HotModuleReplacementPlugin()
  ]),
  devServer: DEVELOP ? {
    disableHostCheck: true,
    historyApiFallback: true,
    inline: true,
    host: '0.0.0.0',
    port: 8000,
    contentBase: path.resolve(__dirname, 'src'),
    hot: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }
  } : {}
}
