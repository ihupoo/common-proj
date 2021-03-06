const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');

module.exports = merge.smart(
    {
        module: {
            rules: [
                { test: /\.(css|scss|sass)$/, use: ['style-loader'] },
                {
                    test: /\.(eot|ttf|woff|svg|woff2|jpe?g|png|gif)$/,
                    use: ['file-loader']
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin() //热更新，还需在index.js里配置
        ],

        devtool: '#cheap-module-eval-source-map', //构建速度快，采用eval执行

        devServer: {
            index: 'login.html',
            openPage: 'portal',
            contentBase: path.resolve(__dirname, '../dist'), //服务路径，存在于缓存中
            host: 'localhost', // 默认是localhost
            port: 8088, // 端口
            open: true, // 自动打开浏览器
            hot: true, // 开启热更新,只监听js文件，所以css假如被抽取后，就监听不到了
            clientLogLevel: 'none', //阻止打印那种搞乱七八糟的控制台信息
            overlay: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '/portal'
                    }
                },
                '/mock': {
                    target: 'http://localhost:8099',
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/mock': '/mock'
                    }
                },
                '/portal': {
                    target: 'http://localhost:8088',
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/portal': '/'
                    }
                },
            }
        },
        mode: 'development'
    },
    base
);
