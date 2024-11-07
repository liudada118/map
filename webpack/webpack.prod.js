const {merge} = require('webpack-merge');
const base = require('./webpack.base.js');


const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
module.exports = merge(base, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
        new UglifyJSPlugin()
    ]
},
});