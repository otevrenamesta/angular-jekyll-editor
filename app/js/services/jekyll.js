
angular.module("app")

.factory('JekyllSrvc', function($http, $window, Conf) {

  var _config = null;

  function _joinArrayVal(val) {
    var rv = [];
    for(var i=0; i<val.length; i++) {
      rv.push(val[i].text);
    }
    return rv.join(',');
  }

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
        val = val.trim();
        if(kv[0] === 'tags') {
          val = val.split(',');
        }
        header[kv[0]] = val;
      }

      return { header: header, content: contents.substring(mark2 + 4) };
    },

    composeHeader: function(header) {
      var rv = '---\n';
      var val;
      for(var k in header) {
        val = header[k];
        if(k === 'tags') {
          val = _joinArrayVal(val);
        }
        rv += k + ': ' + val + '\n';
      }
      rv += '---\n';
      return rv;
    },

    getConfig: function() {
      if(_config === null) {
        // get config from repo
        _config = {
          'tags': ['tag1', 'tag2', 'tag3'],
          'cats': ['udalosti', 'smlouvy', 'zapisy', 'clanky']
        };
      }
      return _config;
    }

  };

});
