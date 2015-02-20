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

  $routeProvider.when('/pages/:path?/edit/', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/:path?/add/', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/:path?', {
    templateUrl: 'content.html',
    controller: 'ContentCtrl'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
