
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.pages = [];

  GithubSrvc.listPages('', function(err, pages) {
    $scope.$apply(function() {
      $scope.subpages = pages;
    });
  });

})

.controller('ContentCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc) {

  $scope.pagepath = $routeParams.path || '';
  $scope.parents = {};
  $scope.subpages = null;

  if($scope.pagepath !== '') {
    var parts = $scope.pagepath.split('/');

    $scope.pagepath = '/' + $scope.pagepath;

    $scope.page = parts.pop();

    var parentLink = [];
    parts.forEach(function(p) {
      parentLink.push(p);
      $scope.parents[p] = parentLink.join('/');
    });
  }

  GithubSrvc.listPages($scope.pagepath, function(err, pages) {
    $scope.$apply(function() {
      $scope.subpages = pages;
    });
  });

});
