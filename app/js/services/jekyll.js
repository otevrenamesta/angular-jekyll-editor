
angular.module("app")

.factory('JekyllSrvc', function($http, $window, Conf) {

  var _config = null;

  return {

    parseYamlHeader: function(contents, done) {
      var mark1 = contents.indexOf('---') + 3;
      var mark2 = contents.indexOf('---', mark1);

      var header = {};

      var hlines = contents.substring(mark1, mark2).split('\n');
      for(var i=0; i<hlines.length; i++) {
        if(hlines[i].length === 0) { continue; }
        var kv = hlines[i].split(':');
        var val = kv[1] || '';
        header[kv[0]] = val.trim();
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
    },

    getConfig: function() {
      if(_config === null) {
        // get config from repo
        _config = {
          'tags': ['t1', 't2', 't3'],
          'cats': ['udalosti', 'smlouvy', 'zapisy', 'clanky']
        };
      }
      return _config;
    }

  };

});
