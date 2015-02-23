
angular.module("app")

.controller('EditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc, JekyllSrvc) {

  $scope.path = $routeParams.path || '';
  $scope.add = $location.path().indexOf('/pages/add/') === 0;
  $scope.commitmessage = '';

  var parts = $scope.path.split('/');
  var parentLink = [];

  $scope.pathparts = {};
  parts.forEach(function(p) {
    $scope.pathparts[p] = parentLink.join('/');
    parentLink.push(p);
  });

  var file = $scope.path + '/index.md';

  if($scope.add) {
    $scope.content = '';
    $scope.url = '';
  } else {
    GithubSrvc.getContent(file, function(err, content) {
      $scope.$apply(function() {
        var parsed = JekyllSrvc.parseYamlHeader(content);
        $scope.content = parsed.content;
        $scope.header = parsed.header;
        $scope.url = $scope.path;
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
      $scope.header.layout = 'default';
      file = $scope.path + "/" + $scope.url + '/index.md';
      GithubSrvc.saveContent(file,
        JekyllSrvc.composeHeader($scope.header) + $scope.content,
        $scope.commitmessage || 'Adding ' + $routeParams.path, _done);
    } else {
      GithubSrvc.updateContent(file,
        JekyllSrvc.composeHeader($scope.header) + $scope.content,
        $scope.commitmessage || 'Updating ' + $routeParams.path, _done);
    }

  };

});
