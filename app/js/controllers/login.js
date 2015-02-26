
angular.module("app")

.controller('LoginCtrl', function($scope, $rootScope, $location, GithubSrvc, SessionSrvc, Conf) {

  $scope.credentials = { username: "", password: "" };
  $scope.error = null;
  $scope.conf = Conf;

  $scope.login = function() {
    GithubSrvc.login($scope.credentials, function(err, userinfo) {
      if (err) {
        $scope.error = 'Invalid usename or password';
      } else {
        var user = angular.copy($scope.credentials, user);
        SessionSrvc.setCurrentUser(user);
        $rootScope.onLoggedIn(userinfo);
        $location.path("/");
      }
    });
  };

});
