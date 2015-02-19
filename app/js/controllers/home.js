
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.pages = [];

  GithubSrvc.listPages('', function(err, pages) {
    $scope.$apply(function() {
      $scope.pages = pages;
    });
  });

})

.controller('ContentCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc) {

  $scope.pagepath = $routeParams.path || '';

  var parts = $scope.pagepath.split('/');

  $scope.folder = parts.pop();
  $scope.pathparts = {};
  var parentLink = [];
  parts.forEach(function(p) {
    $scope.pathparts[p] = parentLink.join('/');
    parentLink.push(p);
  });

  GithubSrvc.listPages($scope.pagepath, function(err, pages) {
    $scope.$apply(function() {
      $scope.pages = pages;
    });
  });

});
