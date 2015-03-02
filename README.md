# Angular based editor for jekyll based sites

This is an angular based editor for [jekyll](http://jekyllrb.com/) based sites.
Is intended to help people that are not familiar with git and/or jekyll site details.
They just want to be able to view page structure, add/edit pages and posts.
And to upload/delete media files.
All this angular-jekyll-editor does.
For details how to use it, please see the [project page](http://www.otevrenamesta.cz/angular-jekyll-editor/).

## technical details

angular-jekyll-editor is [SPA web application](http://en.wikipedia.org/wiki/Single-page_application) build with [Lineman](http://www.linemanjs.com).
The core is [angular](https://angularjs.org/) with plugins (see [bower.json](bower.json) for the list).
It communicates only with [github](https://github.com) through [github API](https://developer.github.com/v3/git/).
For this purpose the [octocat.js library](https://github.com/philschatz/octokat.js) us used.

> This all means that there is no backend nor storage.
> All data are only within targeted repository.

## configuration

Done only with environment variables:

- REPO: address of targeted repository without github.com prefix (e.g.: piratek/piratek.github.io)
- SITEURL: host url where jekyll site is served. Typically on your domain or e.g http://kolovraty.github.io


## installation

Dependencies are [node.js](https://nodejs.org/) and its package manager [npm](https://www.npmjs.com/).
You can try if you have them with this command:

```
node -v && npm -v && echo 'OK, I have them ...'
```

If no, the most convinient way is use [nvm](https://github.com/creationix/nvm).

The most easy way is deploy angular-jekyll-editor on [heroku](https://www.heroku.com/).

```
heroku create my-organisation-webadmin
heroku config:set REPO=piratek/piratek.github.io
heroku config:set SITEURL=http://www.mysuperjekyllsite.com
git push heroku master
```

Or you can generate the static files on your own.

```
export REPO=piratek/piratek.github.io
export SITEURL=http://www.mysuperjekyllsite.com
lineman build
# now you have all files in dist folder
# NOTE: currently js uglification is broken so you need copy unuglified files:
# cp -r generated/js dist
```

Then you can upload them to FTP storage or wherever they are served as static files.

NOTE: in this cas you have to ensure that notexistent routes are routed to index.html.
