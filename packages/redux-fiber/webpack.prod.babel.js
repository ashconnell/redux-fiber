import webpack from 'webpack'
import merge from 'webpack-merge'
import common from './webpack.common.babel'

export default merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
