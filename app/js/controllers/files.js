
angular.module("app")

.controller('FilesListCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.files = [];
  $scope.queue = {};

  GithubSrvc.getFiles(null, function(err, results) {
    $scope.$apply(function() {
      $scope.files = results;
    });
  });

  $scope.upload = function(files) {

    var f;

    function _upload() {
      if(files.length === 0) { return; }

      f = files.pop();
      GithubSrvc.uploadFile(f, function(err, info) {
        $scope.$apply(function() {
          delete $scope.queue[f.name];
          if(err) {
            return alert(err);
          }
          $scope.files.push(info.content);
        });
        _upload();
      });
    }

    for(var i=0; i<files.length; i++) {
      $scope.queue[files[i].name] = files[i];
    }
    _upload();
  };

  $scope.delete = function(f) {
    GithubSrvc.deleteFile(f, function(err, info) {
      $scope.$apply(function() {
        $scope.files.splice($scope.files.indexOf(f), 1);
      });
    });
  };

});
