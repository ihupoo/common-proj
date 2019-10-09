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
                },
                {
                    loader: 'sass-resources-loader',
                    options: {
                        resources: [
                            // resolve方法第二个参数为scss配置文件地址，如果有多个，就进行依次添加即可
                            path.resolve(__dirname, '../src/styles/variable.scss'),
                        ],
                    }
                },]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新，还需在index.js里配置

    ],

    devtool: '#cheap-module-eval-source-map',//构建速度快，采用eval执行

    devServer: {
        index: 'login.html',
        contentBase: path.resolve(__dirname, '../dist'), //服务路径，存在于缓存中
        host: 'localhost', // 默认是localhost
        port: 8088, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新,只监听js文件，所以css假如被抽取后，就监听不到了
        // proxy: xxx //接口代理配置
        clientLogLevel: "none", //阻止打印那种搞乱七八糟的控制台信息
        overlay: true,
    },
    mode: 'development'

})
