###
Exports a function which returns an object that overrides the default &
   plugin grunt configuration object.
###

module.exports = (lineman) ->

  app = lineman.config.application

  # gettext stuff
  app.loadNpmTasks.push "grunt-angular-gettext"
  app.prependTasks.common.push "nggettext_compile"

  # config
  _defaultrepos = [
    {site: 'http://piratek.github.io', repo: 'piratek/piratek.github.io'}
    {site: 'http://tabor.pirati.cz', repo: 'pirati-web/tabor.pirati.cz'}
  ]

  _cfg =
    apiurl: process.env.API_URL || ''
    repos: process.env.REPOS || JSON.stringify(_defaultrepos)

  app.pages.dev.context.env_cfg = app.pages.dist.context.env_cfg = _cfg

  less:
    options:
      paths: app.less.options.paths.concat([
        # "vendor/foundation/css/"
        "vendor/bower/font-awsome/less/"
      ])

  uglify:
    options:
      mangle: false

  server:
    pushState: true
    web:
      port: process.env.PORT || 8000

  nggettext_extract:
    all:
      files:
        'config/i18n/template.pot': ['app/templates/**/*.html']

  nggettext_compile:
    all:
      files:
        'app/js/translations.js': ['config/i18n/*.po']
