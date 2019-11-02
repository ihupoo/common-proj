const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');
const Dotenv = require('dotenv-webpack');
const { logger } = require('./utils')

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
            new webpack.HotModuleReplacementPlugin(), //热更新，还需在index.js里配置
            new Dotenv({
                path: path.resolve(__dirname,'../.env.dev')
            })
        ],

        devtool: '#cheap-module-eval-source-map', //构建速度快，采用eval执行

        devServer: {
            index: 'login.html',
            contentBase: path.resolve(__dirname, '../dist'), //服务路径，存在于缓存中
            host: 'localhost', // 默认是localhost
            port: 8088, // 端口
            open: true, // 自动打开浏览器
            hot: true, // 开启热更新,只监听js文件，所以css假如被抽取后，就监听不到了
            clientLogLevel: 'none', //阻止打印那种搞乱七八糟的控制台信息
            overlay: true,
            proxy: {
                '/portal': {
                    target: 'http://localhost:8080/portal',
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/portal': ''
                    },
                    bypass: function(req, res, proxyOptions) {
                        if (req.headers.accept.indexOf('html') !== -1) {
                            
                            let originalUrl = req.originalUrl;
                            let page = originalUrl.replace(/\/(portal)/g, '')

                            return page === '' ? '/login.html' : `${page}.html`;
                        }
                        if(/.(jpe?g|png|gif|css|scss|js)/g.test(req.originalUrl)){
                            let originalUrl = req.originalUrl;
                            let page = originalUrl.replace(/\/(portal)/g, '')

                            return  `${page}`;
                        }
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
            }
        },
        mode: 'development'
    },
    base
);
