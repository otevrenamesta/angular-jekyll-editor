
angular.module("app")

.controller('LoginCtrl', [
'$scope', '$rootScope', '$location', 'GithubSrvc', 'SessionSrvc', 'Conf',
function($scope, $rootScope, $location, GithubSrvc, SessionSrvc, Conf) {

  $scope.credentials = { username: "", password: "" };
  $scope.selectedRepo = SessionSrvc.getLastRepo() || '';
  $scope.error = null;
  $scope.conf = Conf;

  $scope.login = function() {
    var s = $scope.selectedRepo;
    GithubSrvc.login($scope.credentials, s.repo, function(err, userinfo) {
      $scope.$apply(function() {
        if (err) {
          $scope.error = 'Invalid usename or password';
        } else {
          var user = angular.copy($scope.credentials, user);
          SessionSrvc.setLastRepo(s);
          SessionSrvc.setCurrentUser(user);
          $rootScope.onLoggedIn(userinfo);
          $location.path("/");
        }
      });
    });
  };

}]);
