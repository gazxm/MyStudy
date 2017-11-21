var path = require('path')
var webpack = require('webpack')

module.exports = {
  cache: true,
  resolve: {
    extensions: ['.js']
  },
  entry: {
    vendor: [
      'react',
      'react-dom',
      // 'redux',
      // 'react-redux',
      'react-router',
      'react-router-transitions',
      'react-addons-css-transition-group',
      // 'redux-thunk',
      // 'react-back2top',
      // 'react-draggable',
      // 'react-free-scrollbar',
      // 'react-number-easing',
      // 'react-slick',
      // 'react-slider',
      'antd-mobile',
      // 'rc-form',
      // 'rc-upload',
      'axios'
    ]
  },
  output: {
    path: path.resolve('./dist/dll'),
    filename: '[name].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      name: '[name]_[hash]'
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      minimize: true,
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
