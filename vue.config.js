const {default: createLogger} = require('if-logger')
const logger = createLogger().addTags('vue.config.js')

module.exports = {
  configureWebpack: config => {
    logger.addTags('webpack').info('devtool: ' + config.devtool)
    // if (process.env.npm_lifecycle_event === 'build:lib') {
    //   config.devtool = false
    //   logger.addTags('webpack').info('devtool(tobe): ' + config.devtool)
    // }
    config.module.rules.push({
      test: /\.pug$/,
      loader: 'pug-plain-loader',
    })
  },
}
