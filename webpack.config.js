var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  target: 'web',
  entry: path.resolve('src', 'app.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'game.js'
  },

  devtool: 'cheap-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      // TypeScript
      // ----------
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        test: /\.ts$/,
        use: [
          { loader: 'awesome-typescript-loader' },
        ]
      },

      // Style
      // -----
      {
        include: [
          path.resolve(__dirname, 'style')
        ],
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },

      // Fonts
      // -----
      {
        include: [
          path.resolve(__dirname, 'fonts'),
        ],
        test: /\.ttf$/,
        use: [
          { loader: 'file-loader', options: {} }
        ]
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin('game.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

