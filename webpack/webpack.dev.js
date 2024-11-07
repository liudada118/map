const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(base, {
  mode: 'development',
  // devServer: {
  //   open: true,
  //   host: '192.168.31.217',
  //   port: '1111',
  //   hot: true
  // }
}))