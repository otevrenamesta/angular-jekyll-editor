###
Exports a function which returns an object that overrides the default &
plugin file patterns (used widely through the app configuration)

To see the default definitions for Lineman's file paths and globs, see:

- https://github.com/linemanjs/lineman/blob/master/config/files.coffee
###

module.exports = (lineman) ->

  # copy fonts
  lineman.config.application.copy.dist.files.push
    expand: true
    cwd: "vendor/bower/font-awsome/fonts"
    src: "**"
    dest: 'dist/fonts'
  lineman.config.application.copy.dev.files.push
    expand: true
    cwd: "vendor/bower/font-awsome/fonts"
    src: "**"
    dest: 'generated/fonts'

  # Override file patterns here
  js:
    vendor: [
      "vendor/bower/js-base64/base64.js"
      "vendor/bower/angular/angular.js"
      "vendor/bower/angular-route/angular-route.js"
      "vendor/bower/ngstorage/ngStorage.js"
      "vendor/bower/angular-gettext/dist/angular-gettext.js"
      "vendor/bower/ng-file-upload/angular-file-upload.js"
      "vendor/bower/angular-foundation/mm-foundation-tpls.js"
      "vendor/bower/octokat/dist/octokat.js"
      "vendor/bower/angular-sanitize/angular-sanitize.js"
      "vendor/bower/showdown/src/showdown.js"
      "vendor/bower/angular-markdown-directive/markdown.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]

  css:
    vendor: [
      "vendor/bower/foundation/css/foundation.css"
    ]
