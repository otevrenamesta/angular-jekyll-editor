
angular.module("app")

.factory('EditorSrvc', function($http, $modal) {

  function _openDialog(prefix, path, done) {

    var modalInstance = $modal.open({
      templateUrl: 'modal.linkselect.html',
      controller: 'LinkSelectionCtrl',
      resolve: {
        setup: function() {
          return { prefix: prefix, path: path };
        }
      }
    });

    modalInstance.result.then(function(link) {
      done(link);
    }, function () {
      done('');
    });

  }

  function _addReplace(content, idx, replacement) {
    content.replace();
  }

  return {

    onContentChange: function(content, path, onChanged) {
      var idx = content.indexOf('![]()');
      if(idx >= 0) {
        return _openDialog('!', path, function(link) {
          return onChanged(content.replace('![]()', link));
        });
      }
      idx = content.indexOf('[]()');
      if(idx >= 0) {
        _openDialog('', path, function(link) {
          return onChanged(content.replace('[]()', link));
        });
      }
    }

  };

});
