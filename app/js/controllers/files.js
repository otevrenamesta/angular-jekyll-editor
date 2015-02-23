
angular.module("app")

.controller('FilesListCtrl', function($scope, $rootScope, $location, GithubSrvc) {

  $scope.files = [];

  GithubSrvc.getFiles(null, function(err, results) {
    $scope.$apply(function() {
      $scope.files = results;
    });
  });

  $scope.add = function() {
    var f = document.getElementById('fileChooser').files[0];

    if(! f) { return; }

    var r = new FileReader();
    r.onloadend = function(e) {
      var data = e.target.result;
      data = data.slice(23); // cut the intro: data:text/plain;base64,

      var file = 'static/media/' + f.name;
      GithubSrvc.saveRawContent(file, data, 'uploading ' + f.name, function(err, info) {
        if(err) {
          return alert(err);
        }
        $scope.$apply(function() {
          $scope.files.push(info.content);
        });
      });

    };
    r.readAsDataURL(f);
  };

  $scope.delete = function(f) {
    GithubSrvc.deleteFile(f, function(err, info) {
      $scope.$apply(function() {
        $scope.files.splice($scope.files.indexOf(f), 1);
      });
    });
  };

});
