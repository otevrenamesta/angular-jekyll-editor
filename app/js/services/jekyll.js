
angular.module("app")

.factory('JekyllSrvc', function($http, $window, Conf) {

  return {

    parseYamlHeader: function(contents, done) {
      var mark1 = contents.indexOf('---') + 3;
      var mark2 = contents.indexOf('---', mark1);

      var header = contents.substring(mark1, mark2);

      return { header: header, content: contents.substring(mark2 + 4) };
    }

  };

});
