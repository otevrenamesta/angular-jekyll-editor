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

  $routeProvider.when('/pages/edit/:path*', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/add/:path*', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/add/', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/edit/', {
    templateUrl: 'edit.html',
    controller: 'EditCtrl'
  });

  $routeProvider.when('/pages/:path*', {
    templateUrl: 'content.html',
    controller: 'ContentCtrl'
  });

  $routeProvider.when('/pages', {
    templateUrl: 'content.html',
    controller: 'ContentCtrl'
  });

  // ------------------- POSTS ---------------------

  $routeProvider.when('/posts/add', {
    templateUrl: 'posts.edit.html',
    controller: 'PostsEditCtrl'
  });

  $routeProvider.when('/posts/edit/:id', {
    templateUrl: 'posts.edit.html',
    controller: 'PostsEditCtrl'
  });

  $routeProvider.when('/posts', {
    templateUrl: 'posts.list.html',
    controller: 'PostsListCtrl'
  });

  // ------------------- POSTS ---------------------

  $routeProvider.when('/files', {
    templateUrl: 'files.list.html',
    controller: 'FilesListCtrl'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
