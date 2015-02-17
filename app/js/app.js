var app = angular.module("app", [
  "ngRoute", "ngStorage", "gettext"
])

.run(function($rootScope, $location, GithubSrvc, SessionSrvc) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/login'];

  // check if current location matches route
  function _routeClean(route) {
    return routesNoRequiringAuth.indexOf(route) >= 0;
  }

  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    // if route requires auth and user is not logged in
    if ((! _routeClean($location.url())) && (! SessionSrvc.isLoggedIn())) {
      // redirect back to login
      $location.path("/login");
    }
  });

  if(SessionSrvc.isLoggedIn()) {
    $rootScope.loggedUser = SessionSrvc.getCurrentUser();
  }

  $rootScope.onLoggedIn = function(user) {
    $rootScope.loggedUser = user;
  };

  $rootScope.logout = function() {
    // return AuthService.logout(function() {
    //   $rootScope.loggedUser = '';
    //   return $location.path("/login");
    // });
  };

})

// automatic redirect to login page when 401 from REST service
// inject authorization header into outgoing reqs
.config(function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope, SessionSrvc) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if (SessionSrvc.getCurrentUser()) {
          config.headers.Authorization = 'Bearer ' + SessionSrvc.getCurrentUser().token;
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

});
