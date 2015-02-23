
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

.controller('PostsEditCtrl', function($scope, $rootScope, $location, $routeParams, GithubSrvc, JekyllSrvc) {

  $scope.id = $routeParams.id || null;
  $scope.commitmessage = '';

  var postFolder = '_posts/';
  var file = postFolder + $scope.id;

  if($scope.id) {
    GithubSrvc.getContent(file, function(err, content) {
      $scope.$apply(function() {
        var parsed = JekyllSrvc.parseYamlHeader(content);
        $scope.content = parsed.content;
        $scope.header = parsed.header;
      });
    });
  } else {
    $scope.content = "";
  }

  $scope.save = function() {
    function _done(err, info) {
      if(err) {
        return alert(err);
      }
      $location.path("/");
    }

    if($scope.id) {
      GithubSrvc.updateContent(file, $scope.content,
        $scope.commitmessage || 'Updating ' + $scope.id, _done);
    } else {
      var now = new Date();
      var f = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
      file = postFolder + f + "-" + $scope.url + '.md';
      GithubSrvc.saveContent(file, $scope.content,
        $scope.commitmessage || 'Adding post' + $scope.url, _done);
    }

  };

});
