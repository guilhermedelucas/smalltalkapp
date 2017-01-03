var app = angular.module('app',['ngRoute']);


(function(){

    app.config(function($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl : 'views/home.html',
                controller     : 'HomeCtrl'
            })

            .when('/username=:id', {
                templateUrl: "views/user.html",
                controller: "single"
            })

            .when('/post=:id', {
                templateUrl: "views/post.html",
                controller: "PostCtrl"
            })

            .when('/about', {
                templateUrl : 'views/about.html',
                controller  : 'AboutCtrl'
            })

            .when('/login', {
                templateUrl : 'views/login.html',
                controller  : 'LoginCtrl'
            })

            .otherwise (
                { redirectTo: '/' }
            );

            // remove the # from url
        $locationProvider.html5Mode(true);
    });
})();
