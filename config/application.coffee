###
Exports a function which returns an object that overrides the default &
   plugin grunt configuration object.
###

module.exports = (lineman) ->

  app = lineman.config.application

  app.pages.dev.context.env_cfg =
    apiurl: process.env.API_URL || ''
    repo: process.env.REPO || 'piratek/piratek.github.io'
    appId: process.env.APPID || 'angular-jekyll-editor'

  app.pages.dist.context.env_cfg =
    apiurl: process.env.API_URL || ''
    repo: process.env.REPO || 'piratek/piratek.github.io'
    appId: process.env.APPID || 'angular-jekyll-editor'

  less:
    options:
      paths: app.less.options.paths.concat([
        # "vendor/foundation/css/"
        "vendor/bower/font-awsome/less/"
      ])

  server:
    pushState: true
    web:
      port: process.env.PORT || 8000
