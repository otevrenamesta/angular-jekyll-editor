var app = angular.module("app", [
  "ngRoute", "ngStorage", "gettext", "btford.markdown", "angularFileUpload",
  "mm.foundation", "ngTagsInput", "ui.tree"
])

.run(['$rootScope', '$location', 'gettextCatalog', 'GithubSrvc', 'SessionSrvc', function($rootScope, $location, gettextCatalog, GithubSrvc, SessionSrvc) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/login'];

  // check if current location matches route
  function _routeClean(route) {
    return routesNoRequiringAuth.indexOf(route) >= 0;
  }

  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    // if route requires auth and user is not logged in
    if ((! _routeClean($location.url())) &&
        (! SessionSrvc.isLoggedIn())) {
      // redirect back to login
      $location.path("/login");
    }
  });

  if(SessionSrvc.isLoggedIn()) {
    var curUser = SessionSrvc.getCurrentUser();
    var lastRepoNfo = SessionSrvc.getLastRepo();
    GithubSrvc.login(curUser, lastRepoNfo.repo, function(err, userinfo) {
      $rootScope.onLoggedIn(userinfo);
    });
  }

  $rootScope.onLoggedIn = function(userinfo) {
    $rootScope.loggedUser = userinfo;
  };

  $rootScope.logout = function() {
    SessionSrvc.logout();
    $rootScope.loggedUser = null;
    $location.path("/login");
  };

  $rootScope.setAttr = function(obj, attr, val) {
    obj[attr] = val;
  };

  gettextCatalog.setCurrentLanguage('cs');

}])

// automatic redirect to login page when 401 from REST service
// inject authorization header into outgoing reqs
.config(['$httpProvider', function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope, SessionSrvc) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if (SessionSrvc.getCurrentUser()) {
          config.headers.Authorization = 'Bearer ' +
            SessionSrvc.getCurrentUser().token;
        }
        return config;
      },

      responseError: function(rejection) {
        if (rejection.status === 401) {
          $rootScope.logout();
        }
        return $q.reject(rejection);
      }
    };
  });

}]);
