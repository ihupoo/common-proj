const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const {  entrys, alias, htmlPlugin } = require('./utils.js')

module.exports = {
    entry: entrys,
    output: {
        filename: '[name].js', //打包后名称
        path: path.resolve(__dirname, '../dist'), //打包后路径
    },
    resolve: {
        mainFields: ['jsnext:main', 'browser', 'main'], //配合tree-shaking，优先使用es6模块化入口（import）,babelrc里需要 modules:false
        extensions: ['.js', '.json', '.css', '.scss'], //可省后缀
        alias: {
            '@': path.resolve(__dirname, '../src'), //别名
            ...alias
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory=true',
                // include: /src/,   //只转化src目录下js
                exclude: /node_modules/ //不转化node_modules目录下js
            },
            {
                test: /\.(html|htm)$/,
                use: 'html-withimg-loader' //html下的img路径
            },
            {
                test: /\.(eot|ttf|woff|svg|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath: 'images/', //打包目录
                        name: '[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.art$/,
                use:'art-template-loader'
            }
        ]
    },
    plugins: [
        ...htmlPlugin,
        new webpack.ProvidePlugin({ //自动加载模块，而不必到处 import 或 require
            '$': 'jquery', //todo
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all', //'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
            maxAsyncRequests: 5,                     // 最大异步请求数， 默认1
            maxInitialRequests: 3,                   // 最大初始化请求书，默认1
            name: true,
            cacheGroups: {
                // 抽离第三方插件
                vendor: {
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'all',
                    name: 'vendor', // 打包后的文件名，任意命名
                    priority: 10 // 设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
                },
                libs:{
                    test: /src[\\/]lib/,
                    chunks:'all',
                    name:'libs',
                    priority: 20
                },
                // 抽离自己写的公共代码，utils这个名字可以随意起
                utils: {
                    chunks: 'all',
                    name: 'utils',
                    minSize: 0, // 只要超出0字节就生成一个新包
                    minChunks: 2, //至少两个chucks用到
                    reuseExistingChunk: true
                }
            }
        },
        //提取webpack运行时的代码
        runtimeChunk: {
            name: 'manifest'
        }
    }

}
