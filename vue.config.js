module.exports = {
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.pug$/,
      loader: 'pug-plain-loader',
    })
  },
}
