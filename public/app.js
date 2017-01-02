var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider, $locationProvider)
{
    // remove the # from url
    $locationProvider.html5Mode(true);

    $routeProvider

    // to the route '/', load the template home.html and the controller 'HomeCtrl'
    .when('/', {
        templateUrl : 'views/home.html',
        controller     : 'HomeCtrl',
    })

    .when('/post:id', {
        templateUrl: "views/post.html",
        controller: "PostCtrl"
    })

    // to the route '/about', load the template about.html and the controller 'AboutCtrl'
    .when('/about', {
        templateUrl : 'views/about.html',
        controller  : 'AboutCtrl',
    })

    // to the rote '/login', load the template login.html and the controller 'LoginCtrl'
    .when('/login', {
        templateUrl : 'views/login.html',
        controller  : 'LoginCtrl',
    })
    // in case of any other redirect to '/'
    .otherwise ({ redirectTo: '/' });
});
