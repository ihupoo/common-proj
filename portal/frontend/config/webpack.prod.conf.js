const webpack = require('webpack');
const base = require('./webpack.base.conf');
const merge = require('webpack-merge');
const path = require("path");
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { cssPlugin } = require('./utils.js')


module.exports = merge.smart(
    {
        output: {
            filename: '[name].[chunkhash].js' //chunkhash:根据自身的内容计算而来
        },
        module: {
            rules: [
                {
                    test: /\.(css|scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|ttf|woff|svg|woff2)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                outputPath: 'images/', //打包目录
                                name: '[name].[hash:7].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                verbose: true
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[name].[contenthash].css'
            }),
            new OptimizeCSSAssetsPlugin(),

            //new webpack.HashedModuleIdsPlugin(), //固化module id
            new SimpleProgressWebpackPlugin({
                format: 'expanded'
            })
            //new BundleAnalyzerPlugin() // 可视化定位体积大的模块, 使用默认配置，启动127.0.0.1:8888
        ],
        optimization: {
            moduleIds: 'hashed',
            splitChunks: {
                chunks: 'all', //'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
                maxAsyncRequests: 5, // 最大异步请求数， 默认1
                maxInitialRequests: 3, // 最大初始化请求书，默认1
                name: true,
                cacheGroups: {
                    ...cssPlugin,
                    // 抽离第三方插件
                    vendor: {
                        test: /node_modules/, // 指定是node_modules下的第三方包
                        chunks: 'all',
                        name: 'vendor', // 打包后的文件名，任意命名
                        priority: 10 // 设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
                    },
                    libs: {
                        test: /src[\\|\/]lib/,
                        chunks: 'all',
                        name: 'libs',
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
        },
        mode: 'production'
    },
    base
);
