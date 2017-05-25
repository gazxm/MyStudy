var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    vendor: [path.join(__dirname, 'src', 'vendors.js')]
  },
  output: {
    path: path.join(__dirname, 'dist', 'dll'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'src', '[name]-manifest.json'),
      name: '[name]',
      context: path.resolve(__dirname, 'src')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    root: path.resolve(__dirname, 'src'),
    modulesDirectories: ['node_modules']
  }
}
