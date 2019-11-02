
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* node 打印log */
function logger() {
    const options = {
        flags: 'a',
        encoding: 'utf8'
    }

    let stdout = fs.createWriteStream(path.join(__dirname, '../log/stdout.log'), options)
    let stderr = fs.createWriteStream(path.join(__dirname, '../log/stderr.log'), options)

    return new console.Console(stdout, stderr)
}

const HTML_META = {
    charset: { charset: 'utf-8' },
    'Content-Security-Policy': {
        'http-equiv': 'Content-Security-Policy',
        content:
            "default-src *;style-src 'self' 'unsafe-inline';script-src 'self' 'unsafe-inline' 'unsafe-eval';img-src 'self' data: http: https:;"
    },
    'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    renderer: 'webkit',
    'format-detection': 'telephone=no'
};

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

/* entry, alias, htmlPlugin*/
function entry_alias_htmlPlugin() {
    //获取多页面的一级文件夹
    const files = glob.sync(path.join(__dirname, '../src/pages/*')).map(page => page.substring(page.lastIndexOf('/') + 1));
    let entrys = {}, //设置多页面入口
        alias = {}, //设置快捷路径
        htmlPlugin = []
        cssPlugin = {};


    files.forEach(file => {

        entrys[file] = `./src/pages/${file}/index.js`
        
        alias[`@${file}`] = path.join(__dirname, `../src/pages/${file}`);

        let plugin = new HtmlWebpackPlugin({
            template: `./src/pages/${file}/index.html`,
            filename: `${file}.html`,
            chunks: [file],
            meta: HTML_META
        });
        htmlPlugin.push(plugin)

        cssPlugin[`${file}Style`] = {
            name: `${file}Style`,
            test: (m, c, entry = file) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true
        }
    });

    return { entrys, alias, htmlPlugin, cssPlugin }
}


module.exports = {
    ...entry_alias_htmlPlugin(),
    logger: logger()
}
