
angular.module("app")

.controller('LinkSelectionCtrl', function($scope, $q, $modalInstance, GithubSrvc, setup) {

  $scope.setup = setup;
  $scope.subpages = [];
  $scope.posts = [];
  $scope.info = {title: '', link: ''};
  $scope.OKdisabled = true;

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

  $scope.ok = function () {
    if($scope.OKdisabled) { return; }
    var result = $scope.setup.prefix + '[' + $scope.info.title + '](' + $scope.info.link + ')';
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

  var protos = [
    {name: 'http://', path: 'http://'},
    {name: 'https://', path: 'https://'},
  ];

  $scope.isCollapsed = function(scope) {
    return $scope.setup.path.indexOf(scope.$modelValue.path) !== 0;
  };

  $scope.dblclick = function(nodescope) {
    var p = nodescope.$modelValue.path;
    var idx = p.indexOf($scope.setup.path);
    if(idx === 0) {  // relative link
      p = p.substring($scope.setup.path.length+1, p.length);
    } else {  // absolute path
      p = '/' + p;
    }
    $scope.info.link = p + '/';
  };

  $scope.loadOptions = function(query) {
    var deferred = $q.defer();

    var inputPath = query.split('/');
    inputPath.pop();
    inputPath = inputPath.join('/');

    var p;

    if(query.indexOf('/') === 0) {  // load site pages
      p = inputPath;
    } else {  // load subpages
      p = $scope.setup.path + inputPath;
    }

    GithubSrvc.listPages(p, function(err, items) {
      items.push(protos[0]);
      items.push(protos[1]);
      deferred.resolve(items);
    });

    return deferred.promise;
  };


});
