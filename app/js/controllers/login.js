
angular.module("app")

.controller('LoginCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.credentials = { username: "", password: "" };
  $scope.error = null;

  $scope.login = function() {
    GithubSrvc.login($scope.credentials, function(err, repoinfo) {
      if (err) {
        $scope.error = 'Invalid usename or password';
      } else {
        $rootScope.onLoggedIn(repoinfo);
        $location.path("/");
      }
    });
  };

});
