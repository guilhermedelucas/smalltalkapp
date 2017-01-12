const app = angular.module("app",["ngRoute"]);

(function(){

    app.config(function($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })

            .when('/post:id', {
                templateUrl: 'views/post.html',
                controller: 'PostCtrl'
            })

            .when('/userposts=:id', {
                templateUrl: 'views/userpost.html',
                controller: 'UserPostsCtrl'
            })

            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })

            .when('/submit', {
                templateUrl : 'views/submit.html',
                controller  : 'SubmitCtrl'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })

            .when('/register',{
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })

            .otherwise (
                { redirectTo: '/' }
            );

        // remove the # from url
        $locationProvider.html5Mode(true);
    });
})();
