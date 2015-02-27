String.prototype.nthIndexOf = function(pattern, n) {
  var i = -1;

  while (n-- && i++ < this.length) {
    i = this.indexOf(pattern, i);
    if (i < 0) { break; }
  }

  return i;
};

angular.module("app")

.controller('LinkSelectionCtrl', function($scope, $q, $modalInstance, GithubSrvc, Conf, setup) {

  $scope.setup = setup;
  $scope.info = {title: '', link: ''};
  $scope.OKdisabled = true;

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

  $scope.options = ['http://', 'https://'];

  $scope.isCollapsed = function(scope) {
    if($scope.setup.path) {
      return $scope.setup.path.indexOf(scope.$modelValue.path) !== 0;
    } else {
      return false;
    }
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

  if($scope.setup.prefix === '') { // link

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

    GithubSrvc.listPosts(function(err, items) {
      for(var i=0; i<items.length; i++) {
        var idx = items[i].name.nthIndexOf('-', 3);
        var link = items[i].name.substr(0, idx).split('-');
        link.push(items[i].name.slice(idx+1, items[i].name.length-3));
        $scope.options.push('/blog/' + link.join('/') + '/');
      };
      GithubSrvc.getFiles('unusedfilter', function(err, items) {
        $scope.$apply(function() {
          items.forEach(function(i) {
            $scope.options.push('/' + i.path);
          });
        });
      });
    });

  } else { // image link

    GithubSrvc.getFiles('unusedfilter', function(err, items) {
      $scope.$apply(function() {
        items.forEach(function(i) {
          $scope.options.push('/' + i.path);
        });
      });
    });

    $scope.$watch('info.link', function(newValue, oldValue) {
      if(newValue.indexOf('://') > 0) {
        $scope.previewUrl = newValue;
      } else {
        $scope.previewUrl = Conf.siteurl + newValue;
      }
    });

  }

});
