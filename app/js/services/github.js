
angular.module("app")

.factory('GithubSrvc', function($http, $window, Conf) {

  return {

    login: function(credentials, done) {
      var octo = new Octokat(credentials);

      var repoinfo = Conf.repo.split('/');
      octo.repos(repoinfo[0], repoinfo[1]).fetch(done);
    },

    list: function(report, done) {
      $http.post(Conf.host + '/api/report', data)
        .success(function(message){
          return done(null, message);
        })
        .error(function(err){
          return done(err);
        });
    }

  };

});
