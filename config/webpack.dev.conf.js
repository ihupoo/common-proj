const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');

module.exports = merge(base, {
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('sass')
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新，还需在index.js里配置

    ],

    devtool: '#source-map', //方便断点调试
    // devtool: '#cheap-module-eval-source-map',//构建速度快，采用eval执行

    devServer: {
        contentBase: path.resolve(__dirname, '../dist'), //服务路径，存在于缓存中
        host: 'localhost', // 默认是localhost
        port: 3000, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新,只监听js文件，所以css假如被抽取后，就监听不到了
        // proxy: xxx //接口代理配置
        clientLogLevel: "none", //阻止打印那种搞乱七八糟的控制台信息
        useLocalIp: true,
        overlay: true,
    },
    mode: 'development'

})
