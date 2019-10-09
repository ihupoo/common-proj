const webpack = require('webpack');
const base = require('./webpack.base.conf');
const merge = require('webpack-merge');
const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { cssPlugin } = require('./utils.js')


module.exports = merge(base, {
    output: {
        filename: '[name].[chunkhash].js', //chunkhash:根据自身的内容计算而来
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
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            minimize: true
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }]
        }]
    },
    plugins: [

        new CleanWebpackPlugin('dist', {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].css',
        }),
        new webpack.HashedModuleIdsPlugin(), //固化module id

        new SimpleProgressWebpackPlugin({
            format: 'expanded',
        }),

        new BundleAnalyzerPlugin() // 可视化定位体积大的模块, 使用默认配置，启动127.0.0.1:8888
    ],
    optimization: {
        splitChunks:{
            cacheGroups:{
                ...cssPlugin
            }
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
            }),
        ]
    },
    mode: 'production'
})
