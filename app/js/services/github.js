
angular.module("app")

.factory('GithubSrvc', function($http, $window, Conf) {

  var _octo, _repo;

  // leave only folders of pages
  function _filterPages(results) {
    var rv = [];
    for(var i=0; i<results.length; i++) {
      // if(results[i].name === 'index.md') { rv.push(results[i]); continue; }
      if(results[i].type !== 'dir') { continue; }
      if(results[i].name.indexOf('_') === 0) { continue; } // skip starting _
      if(results[i].name !== 'static') { rv.push(results[i]); }
    }
    return rv;
  }

  function _getRepo() {
    if(!_repo) {
      var repoinfo = Conf.repo.split('/');
      _repo = _octo.repos(repoinfo[0], repoinfo[1]);
    }
    return _repo;
  }

  function _saveContent(path, content, message, sha, done) {
    var config = { message: message, content: content };
    if(sha) { config.sha = sha; }  // we are updating
    _getRepo().contents(path).add(config).then(function(newinfo) {
      done(null, newinfo);
    }).then(null, function(e) {
      done(e);
    });
  }

  function _delete(file, message, done) {
    var config = { message: message, sha: file.sha };

    _getRepo().contents(file.path).remove(config).then(function(newinfo) {
      done(null, newinfo);
    });
  }

  return {

    login: function(credentials, done) {
      _octo = new Octokat(credentials);
      _octo.me.fetch(done);
    },

    repoinfo: function(done) {
      _getRepo().fetch(done);
    },

    listPages: function(path, done) {
      if(path === '/') { path = ''; }
      _getRepo().contents(path).read(function(err, content) {
        if(err) { return done(err); }

        var pages = _filterPages(JSON.parse(content));

        done(null, pages);
      });
    },

    getContent: function(path, done) {
      _getRepo().contents(path).read(function(err, content) {
        if(err) { return done(err); }
        done(null, content);
      });
    },

    updateContent: function(path, content, message, done) {
      _getRepo().contents(path).fetch().then(function(info) {
        _saveContent(path, Base64.encode(content), message, info.sha, done);
      });
    },

    saveContent: function(path, content, message, done) {
      _saveContent(path, Base64.encode(content), message, null, done);
    },

    saveRawContent: function(path, content, message, done) {
      _saveContent(path, content, message, null, done);
    },

    listPosts: function(done) {
      _getRepo().contents('_posts').read(function(err, content) {
        if(err) { return done(err); }

        done(null, JSON.parse(content));
      });
    },

    getFiles: function(filter, done) {
      _getRepo().contents('static/media').read(function(err, content) {
        if(err) { return done(err); }

        done(null, JSON.parse(content));
      });
    },

    deleteFile: function(file, done) {
      _delete(file, 'Removing media ' + file.name, done);
    },

    deletePost: function(file, done) {
      _delete(file, 'Removing post ' + file.name, done);
    },

    deletePage: function(file, done) {
      if(file.path.length === 0) {return;}
      var p = file.path + '/index.md';
      _getRepo().contents(p).fetch(function(err, content) {
        if(err) { return done(err); }
        _delete(content, 'Removing page ' + file.name, done);
      });
    },

    uploadFile: function(f, category, done) {
      var r = new FileReader();

      r.onloadend = function(e) {
        var data = e.target.result;
        data = data.slice(data.indexOf('base64,') + 7); // cut the intro

        var fileName = 'static/media/';
        if(category.length > 0) {
          fileName = fileName + category + '-';
        }
        fileName += f.name;
        _saveContent(fileName, data, 'uploading ' + f.name, null, done);
      };
      r.readAsDataURL(f);
    },

    listRepoEvents: function(done) {
      _getRepo().events.fetch(function(err, items) {
        if(err) { return done(err); }
        return done(null, items);
      });
    }

  };

});
