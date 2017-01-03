(function () {

    app.controller('HomeCtrl', function($rootScope, $location, $scope, $http, $location)
    {
        $rootScope.activetab = $location.path();

        $http.get('/home').then(function(resp){
            $scope.posts = resp.data.posts;
            console.log($scope.posts);
        });
    });
})();



///need to create an query that mergers table comment with posts
