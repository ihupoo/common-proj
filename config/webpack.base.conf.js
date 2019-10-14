const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const {  entrys, alias, htmlPlugin } = require('./utils.js')

module.exports = {
    entry: entrys,
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss'], //可省后缀
        alias: {//别名
            '@': path.resolve(__dirname, '../src'), 
            'images': '@/assets/images', 
            'jquery-namespace': '@/lib/namespace/jquery.namespace.js',
            ...alias
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory=true',
                // include: /src/,   //只转化src目录下js
                exclude: /node_modules|src[\\|\/]lib/ //不转化node_modules目录和src/lib下js
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    },
                    // {
                    //     loader: 'sass-resources-loader',
                    //     options: {
                    //         resources: [
                    //             // resolve方法第二个参数为scss配置文件地址，如果有多个，就进行依次添加即可
                    //             path.resolve(__dirname, '../src/styles/reset.scss')
                    //         ]
                    //     }
                    // }
                ]
            },
            {
                test: /\.(html|htm)$/,
                use: 'html-withimg-loader' //html下的img路径
            },
            {
                test: /\.art$/,
                use: 'art-template-loader'
            }
        ]
    },
    plugins: [
        ...htmlPlugin,
        new webpack.ProvidePlugin({ //自动加载模块，而不必到处 import 或 require
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
    ],
}
