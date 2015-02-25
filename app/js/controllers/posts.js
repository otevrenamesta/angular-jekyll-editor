
angular.module("app")

.controller('PostsListCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  GithubSrvc.listPosts(function(err, posts) {
    $scope.$apply(function() {
      $scope.posts = posts;
    });
  });

  $scope.delete = function(post) {
    GithubSrvc.deletePost(post, function(err, info) {
      $scope.$apply(function() {
        $scope.posts.splice($scope.posts.indexOf(post), 1);
      });
    });
  };

})

.controller('PostsEditCtrl', function($scope, $rootScope, $location, $routeParams, $q, GithubSrvc, JekyllSrvc, EditorSrvc) {

  $scope.id = $routeParams.id || null;
  $scope.commitmessage = '';
  $scope.jekyllCfg = JekyllSrvc.getConfig();

  var postFolder = '_posts/';
  var file = postFolder + $scope.id;

  if($scope.id) {
    GithubSrvc.getContent(file, function(err, content) {
      $scope.$apply(function() {
        var parsed = JekyllSrvc.parseYamlHeader(content);
        if(! parsed.header.category) {
          parsed.header.category = $scope.jekyllCfg.cats[0];
          parsed.header.tags = parsed.header.tags || [];
        }
        $scope.content = parsed.content;
        $scope.header = parsed.header;
      });
    });
  } else {
    $scope.content = '';
    $scope.header = { category: $scope.jekyllCfg.cats[0], tags: [] };
  }


  $scope.save = function() {
    function _done(err, info) {
      if(err) {
        return alert(err);
      }
      $scope.$apply(function() {
        $location.path("/posts");
      });
    }

    $scope.header.layout = $scope.header.layout || 'post';

    if($scope.id) {
      GithubSrvc.updateContent(file,
        JekyllSrvc.composeHeader($scope.header) + $scope.content,
        $scope.commitmessage || 'Updating ' + $scope.id, _done);
    } else {
      var slug = window.slug($scope.header.title).toLowerCase();
      var now = new Date();
      var f = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
      file = postFolder + f + "-" + slug + '.md';
      GithubSrvc.saveContent(file,
        JekyllSrvc.composeHeader($scope.header) + $scope.content,
        $scope.commitmessage || 'Adding post' + $scope.url, _done);
    }

  };

  $scope.onContentChange = function() {
    EditorSrvc.onContentChange($scope.content, null, function(newContent) {
      $scope.content = newContent;
    });
  };

  $scope.loadTags = function(query) {
    var deferred = $q.defer();

    setTimeout(function() {
      deferred.resolve($scope.jekyllCfg.tags);
    }, 50);

    return deferred.promise;
  };

});
