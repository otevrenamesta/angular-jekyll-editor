
angular.module("app")

.controller('HomeCtrl', [
'$scope', '$rootScope', '$location', 'GithubSrvc',
function($scope, $rootScope, $location, GithubSrvc) {

  $scope.events = null;

  GithubSrvc.listRepoEvents(function(err, events) {
    $scope.$apply(function() {
      $scope.events = events;
    });
  });

}]);
