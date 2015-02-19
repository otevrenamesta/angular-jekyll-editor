
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

  return {

    login: function(credentials, done) {
      _octo = new Octokat(credentials);
      _octo.me.fetch(done);
    },

    repoinfo: function(done) {
      _getRepo().fetch(done);
    },

    listPages: function(path, done) {
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

    saveContent: function(path, content, message, done) {
      _getRepo().contents(path).fetch().then(function(info) {
        var config = {
          message: message,
          content: Base64.encode(content),
          sha: info.sha
        };
        _getRepo().contents(path).add(config).then(function(newinfo) {
          done(null, newinfo);
        });
      });
    }

  };

});
