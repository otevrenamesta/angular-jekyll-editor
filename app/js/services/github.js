
angular.module("app")

.factory('GithubSrvc', function($http, $window, Conf) {

  var _octo, _repo;

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
      _getRepo().fetch(function(err, done) {
        console.log(err);
      });
      _getRepo().contents('index.md').read(function(err, done) {
        console.log(err);
      });
    }

  };

});
