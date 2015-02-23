
angular.module("app")

.factory('JekyllSrvc', function($http, $window, Conf) {

  return {

    parseYamlHeader: function(contents, done) {
      var mark1 = contents.indexOf('---') + 3;
      var mark2 = contents.indexOf('---', mark1);

      var header = {};

      var hlines = contents.substring(mark1, mark2).split('\n');
      for(var i=0; i<hlines.length; i++) {
        if(hlines[i].length === 0) { continue; }
        var kv = hlines[i].split(':');
        header[kv[0]] = kv[1].trim();
      }

      return { header: header, content: contents.substring(mark2 + 4) };
    },

    composeHeader: function(header) {
      var rv = '---\n';
      for(var k in header) {
        rv += k + ': ' + header[k] + '\n';
      }
      rv += '---\n';
      return rv;
    }

  };

});
