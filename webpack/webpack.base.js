/** @format */

const path = require('path')
const { SRC_PATH, DIST_PATH, ISDEV } = require('./variable')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const threadLoader = require('thread-loader')
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const jsWorkerPool = {
  worker: 2,
  poolTimeout: 2000,
}
const cssWorkerPool = {
  workerParallelJobs: 2,
  poolTimeout: 2000,
}

threadLoader.warmup(jsWorkerPool, ['babel-loader'])
threadLoader.warmup(cssWorkerPool, ['css-loader', 'style-loader'])

module.exports = {
  cache: {
    type: 'filesystem',
  },
  entry: {
    path: path.join(SRC_PATH, 'index.jsx'),
  },
  output: {
    path: DIST_PATH,
    filename: 'bundle.js',
    // assetMoudleFilename : 'img/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.js', '.tsx', '.jsx'],
    alias: {
      '@': SRC_PATH,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool,
          },
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true },
          },
        ],
        include: SRC_PATH,
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',

          'css-loader',
          {
            loader: 'thread-loader',
            options: cssWorkerPool,
          },
        ],

        // exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        // include : /(node_modules\/antd|src)/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
          {
            loader: 'thread-loader',
            options: cssWorkerPool,
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif)/i,
        type: 'asset',
        generator: {
          filename: 'img/[hash][ext][query]' // 局部指定输出位置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 限制于 8kb
          }
        }
      }

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html', // 定义的html为模板生成 从根路径开始查找
      inject: 'body',
      minify: ISDEV
        ? {}
        : {
          // 压缩HTML文件
          removeComments: true, //去除注释
          collapseWhitespace: true, //去除空格
        },
    }),
    // new HardSourceWebpackPlugin(),
  ],
}
