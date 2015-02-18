
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  GithubSrvc.listPages('/', function(err, pages) {
    $scope.pages = pages;
  });

});
