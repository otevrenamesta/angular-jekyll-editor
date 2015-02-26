
angular.module("app")

.controller('PageEditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc, JekyllSrvc, EditorSrvc) {

  $scope.path = $routeParams.path || '';
  $scope.add = $location.path().indexOf('/pages/add/') === 0;
  $scope.commitmessage = '';

  var file = ($scope.path.length) ? $scope.path + '/' : '';

  if($scope.add) {
    $scope.content = '';
  } else {
    file = file + 'index.md';
    GithubSrvc.getContent(file, function(err, content) {
      $scope.$apply(function() {
        var parsed = JekyllSrvc.parseYamlHeader(content);
        $scope.content = parsed.content;
        $scope.header = parsed.header;
      });
    });
  }


  $scope.save = function() {
    function _done(err, info) {
      if(err) {
        return alert(err);
      }
      $scope.$apply(function() {
        $location.path("/pages");
      });
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
    EditorSrvc.onContentChange($scope.content, $scope.path, function(newContent) {
      $scope.content = newContent;
    });
  };

})

.controller('PageTreeCtrl', function($scope, $rootScope, $location, $routeParams, $sce, GithubSrvc, JekyllSrvc, Conf) {

  $scope.treeOptions = {
    accept: function(sourceNodeScope, destNodesScope, destIndex) {
      return true;
    },
  };

  $scope.ttoggle = function(scope) {
    scope.toggle();
    $scope.frameUrl = $sce.trustAsResourceUrl(Conf.siteurl + '/' + scope.$modelValue.path);
  };

  $scope.frameUrl = $sce.trustAsResourceUrl(Conf.siteurl);

  GithubSrvc.listPages('', function(err, rootpages) {

    function _loadNode(n) {
      GithubSrvc.listPages(n.path, function(err, pages) {
        $scope.$apply(function() {
          if(err || pages.length === 0) { n.nodes = []; return; }
          pages.forEach(function(p) { _loadNode(p); });
          n.nodes = pages;
        });
      });
    }

    rootpages.forEach(function(p) { _loadNode(p); });
    $scope.$apply(function() {
      $scope.pages = [{
        name: '/', path: '', nodes: rootpages
      }];
    });
  });

  $scope.removeP = function(nodescope) {
    if(window.confirm('X-| ' + nodescope.$modelValue.path + ' ?')) {
      GithubSrvc.deletePage(nodescope.$modelValue, function(err, info) {
        $scope.$apply(function() {
          var p = nodescope.$parentNodesScope.$modelValue;
          p.splice(p.indexOf(nodescope.$modelValue), 1);
        });
      });
    }
  };

});
