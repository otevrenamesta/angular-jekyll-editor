
angular.module("app")

.controller('EditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc) {

  $scope.path = $routeParams.path || '';
  $scope.add = $location.path().indexOf('/pages/add/') === 0;
  $scope.commitmessage = '';
  $scope.url = '';

  var parts = $scope.path.split('/');
  var parentLink = [];

  $scope.pathparts = {};
  parts.forEach(function(p) {
    $scope.pathparts[p] = parentLink.join('/');
    parentLink.push(p);
  });

  var file = $scope.path + '/index.md';

  if($scope.add) {
    $scope.content = "";
  } else {
    GithubSrvc.getContent(file, function(err, content) {
      $scope.$apply(function() {
        $scope.content = content;
      });
    });
  }


  $scope.save = function() {
    function _done(err, info) {
      if(err) {
        return alert(err);
      }
      $location.path("/");
    }

    if($scope.add) {
      file = $scope.path + "/" + $scope.url + '/index.md';
      GithubSrvc.saveContent(file, $scope.content,
        $scope.commitmessage || 'Adding ' + $routeParams.path, _done);
    } else {
      GithubSrvc.updateContent(file, $scope.content,
        $scope.commitmessage || 'Updating ' + $routeParams.path, _done);
    }

  };

});
