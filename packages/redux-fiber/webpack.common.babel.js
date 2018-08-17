import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'redux-fiber.js',
    library: 'reduxFiber',
    libraryTarget: 'umd',
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
}
