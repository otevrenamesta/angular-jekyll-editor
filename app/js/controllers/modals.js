
angular.module("app")

.controller('LinkSelectionCtrl', function($scope, $modalInstance, GithubSrvc, prefix) {

  $scope.subpages = [];
  $scope.posts = [];
  $scope.info = {title: '', link: ''};
  $scope.OKdisabled = true;

  GithubSrvc.listPages('', function(err, pages) {
    $scope.$apply(function() {
      $scope.subpages = pages;
    });
  });

  $scope.ok = function () {
    if($scope.OKdisabled) { return; }
    var result = prefix + '[' + $scope.info.title + '](' + $scope.info.link + ')';
    $modalInstance.close(result);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  function formOK() {
    return $scope.info.title.length > 0 && $scope.info.link.length > 0;
  }

  $scope.$watch('info.title', function(newValue, oldValue) {
    $scope.OKdisabled = ! formOK();
  });
  $scope.$watch('info.link', function(newValue, oldValue) {
    $scope.OKdisabled = ! formOK();
  });

});
