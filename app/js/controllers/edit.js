
angular.module("app")

.controller('EditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc) {

  var file = $routeParams.path + '/index.md';

  $scope.path = $routeParams.path;
  $scope.commitmessage = '';

  GithubSrvc.getContent(file, function(err, content) {
    $scope.$apply(function() {
      $scope.content = content;
    });
  });

  $scope.save = function() {
    GithubSrvc.saveContent(file, $scope.content,
      $scope.commitmessage || 'Updating ' + $routeParams.path,
      function(err, info) {
      if(err) {
        return alert(err);
      }
      $location.path("/");
    });
  };

});
