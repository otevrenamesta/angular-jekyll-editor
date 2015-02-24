
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.pages = [];

  GithubSrvc.listPages('', function(err, pages) {
    $scope.$apply(function() {
      $scope.subpages = pages;
    });
  });

});
