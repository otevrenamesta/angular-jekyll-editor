angular.module("app")

.config([
'$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

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

  // ------------------- PAGES ---------------------

  $routeProvider.when('/pages/edit/:path*', {
    templateUrl: 'pages.edit.html',
    controller: 'PageEditCtrl'
  });

  $routeProvider.when('/pages/add/:path*', {
    templateUrl: 'pages.edit.html',
    controller: 'PageEditCtrl'
  });

  $routeProvider.when('/pages/add/', {
    templateUrl: 'pages.edit.html',
    controller: 'PageEditCtrl'
  });

  $routeProvider.when('/pages/edit/', {
    templateUrl: 'pages.edit.html',
    controller: 'PageEditCtrl'
  });

  $routeProvider.when('/pages', {
    templateUrl: 'pages.tree.html',
    controller: 'PageTreeCtrl'
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

}]);
