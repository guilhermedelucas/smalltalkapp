(function() {

    app.controller('HomeCtrl', function($rootScope, $location, $scope, $http) {
        //login//
        //display posts//
        $scope.counter = 0;
        $rootScope.activetab = $location.path();
        queryRequest($scope, $http);
        $scope.morePage = function() {
            $scope.counter++;
            queryRequest($scope, $http);
        }
        $scope.getPostInfo = function(post) {
            $rootScope.postData = post;
        }
    });
})();

var queryRequest = function($scope, $http) {
    $http.get('/home/' + $scope.counter).then(function(resp) {
        $scope.logged = false;
        if (resp.data.session) {
            $scope.username = resp.data.session;
            $scope.logged = true;
        }
        console.log($scope.logged);
        $scope.posts = resp.data.posts;
        $scope.posts.map(function(element) {
            var currentTime = new Date();
            var postTime = new Date(element.created_at.replace(' ', 'T'));
            var displayTime = (currentTime - postTime) / 1000;
            if (displayTime < 3600) {
                element.created_at = Math.round(displayTime / 60) + " minutes ago";
            } else if (displayTime < 86400) {
                element.created_at = Math.round(displayTime / 3600) + " hours ago";
            } else {
                element.created_at = Math.round(displayTime / 86400) + " days ago";
            }
        })
    });
};
