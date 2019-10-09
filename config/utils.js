const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    const files = glob.sync(path.join(__dirname, '../src/pages/*')).map(page => page.split('/').splice(-1));

    let entrys = {}, //设置多页面入口
        alias = {}, //设置快捷路径
        htmlPlugin = []
        cssPlugin = {};


    files.forEach(file => {
        entrys[file] = `./src/pages/${file}/index.js`
        alias[`@${file}`] = path.join(__dirname, `../src/pages/${file}`);
        let plugin =  new HtmlWebpackPlugin({
            template: `./src/pages/${file}/index.html`,
            filename: `${file}.html`,
            minify: { // 压缩 HTML 文件
                removeComments: true, // 移除 HTML 中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true // 压缩内联 css
            },
            chunks: ['manifest', 'vendor', 'libs' ,'utils', `${file}`]
        })
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
    ...entry_alias_htmlPlugin()
}
