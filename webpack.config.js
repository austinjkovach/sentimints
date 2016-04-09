var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    './client/components/app.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, 
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  plugins: [HTMLWebpackPluginConfig]
}