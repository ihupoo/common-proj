module.exports = {
  plugins: [
      // 处理 @import
      require('postcss-import')(),
      // 处理 css 中 url
      require('postcss-url')(),
      // 自动前缀
      require('autoprefixer')()
  ]
};
