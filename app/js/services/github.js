
angular.module("app")

.factory('GithubSrvc', function($http, $window, Conf) {

  var _octo, _repo;

  // leave only index and folders of pages
  function _filterRootPages(results) {
    var rv = [];
    for(var i=0; i<results.length; i++) {
      if(results[i].name === 'index.md') { rv.push(results[i]); continue; }
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

        var pages = JSON.parse(content);

        if(path === '') {
          pages = _filterRootPages(pages);
        }

        done(null, pages);
      });
    }

  };

});
