angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  // ------------------- AUTH ---------------------
  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  });

  // ------------------- APP ---------------------
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
