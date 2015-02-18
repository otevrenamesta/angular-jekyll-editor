
angular.module("app")

.factory('SessionSrvc', function($localStorage, $location, Conf) {

  var _cuKey = $location.host() + $location.port() + Conf.appId + 'currentUser';

  return {
    setCurrentUser: function(currentUser) {
      $localStorage[_cuKey] = currentUser;
    },

    getCurrentUser: function() {
      return $localStorage[_cuKey] || null;
    },

    isLoggedIn: function() {
      return $localStorage.hasOwnProperty(_cuKey);
    },

    logout: function() {
      delete $localStorage[_cuKey];
    }
  };

});
