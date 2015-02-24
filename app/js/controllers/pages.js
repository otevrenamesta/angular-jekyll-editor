
angular.module("app")

.controller('PageContentCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc, JekyllSrvc) {

  $scope.pagepath = $routeParams.path || '';
  $scope.parents = {};
  $scope.subpages = $scope.content = null;

  if($scope.pagepath !== '') {
    var parts = $scope.pagepath.split('/');

    $scope.pagepath = '/' + $scope.pagepath;

    $scope.page = parts.pop();

    var parentLink = [];
    parts.forEach(function(p, idx) {
      parentLink.push(p);
      $scope.parents[p] = parentLink.join('/');
      if(idx === (parts.length-1)) {
        $scope.parent = parentLink.join('/');
      }
    });
  }

  GithubSrvc.listPages($scope.pagepath, function(err, pages) {
    $scope.$apply(function() {
      $scope.subpages = pages;
    });
  });

  var file = ($scope.pagepath.length) ? $scope.pagepath + '/' : '';
  file = file + 'index.md';
  GithubSrvc.getContent(file, function(err, content) {
    $scope.$apply(function() {
      var parsed = JekyllSrvc.parseYamlHeader(content);
      $scope.content = parsed.content;
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

  var file = ($scope.path.length) ? $scope.path + '/' : '';

  if($scope.add) {
    $scope.content = '';
    $scope.url = '';
  } else {
    file = file + 'index.md';
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
      var slug = window.slug($scope.header.title).toLowerCase();
      file = file + slug + '/index.md';
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
