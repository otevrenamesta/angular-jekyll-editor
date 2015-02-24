
angular.module("app")

.controller('PageContentCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc) {

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

})

.controller('PageEditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc, JekyllSrvc, EditorSrvc) {

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

  var file = ($scope.path.length) ? $scope.path + '/index.md' : 'index.md';

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

  $scope.onContentChange = function() {
    EditorSrvc.onContentChange($scope.content, function(newContent) {
      $scope.content = newContent;
    });
  };

});
