(function() {

    app.controller('AboutCtrl', function($rootScope, $scope, $location, $http) {
            $rootScope.activetab = $location.path();
            $http.get('/profile').then(function(resp) {
                console.log(resp.data.userData[0]);
                $scope.email = resp.data.userData[0].email;
                $scope.username = resp.data.session;
                $scope.logged = true;
            })
        })
})();
