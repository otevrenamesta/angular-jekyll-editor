
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.events = null;

  GithubSrvc.listRepoEvents(function(err, events) {
    $scope.$apply(function() {
      $scope.events = events;
    });
  });

});
