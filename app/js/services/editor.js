
angular.module("app")

.factory('EditorSrvc', function($http, $modal) {

  function _openDialog(prefix, done) {

    var modalInstance = $modal.open({
      templateUrl: 'modal.linkselect.html',
      controller: 'LinkSelectionCtrl',
      resolve: {
        prefix: function() { return prefix; }
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

    onContentChange: function(content, onChanged) {
      var idx = content.indexOf('![]()');
      if(idx >= 0) {
        return _openDialog('!', function(link) {
          return onChanged(content.replace('![]()', link));
        });
      }
      idx = content.indexOf('[]()');
      if(idx >= 0) {
        _openDialog('', function(link) {
          return onChanged(content.replace('[]()', link));
        });
      }
    }

  };

});
