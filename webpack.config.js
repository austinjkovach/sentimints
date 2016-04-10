var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    './client/components/app.jsx',
    './client/public/style.css',
    './node_modules/react-date-picker/index.css'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },

  module: {
    loaders: [
      { 
        test: /\.jsx?$/, 
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
        exclude: /node_modules/
      },
      { test: /\.css$/, loaders: ["style", "css"], include: path.resolve(__dirname, 'client/public') }
    ]
  },
  plugins: [HTMLWebpackPluginConfig]
}