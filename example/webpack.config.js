const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    library: 'index',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  plugins: [new CopyWebpackPlugin([{from: 'wsdls/*.wsdl'}])],
};