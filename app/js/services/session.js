
angular.module("app")

.factory('SessionSrvc', [
'$localStorage', '$location', function($localStorage, $location) {

  var _cuKey = $location.host() + $location.port() + 'currentUser';
  var _lastRepo = _cuKey + 'lastRepo';

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
    },

    setLastRepo: function(lastRepo) {
      $localStorage[_lastRepo] = lastRepo;
    },

    getLastRepo: function() {
      return $localStorage[_lastRepo];
    }
  };

}]);
