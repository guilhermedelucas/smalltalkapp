(function () {

    app.controller('PostCtrl', function($rootScope, $location, $scope, $http, $location)
    {
        $rootScope.activetab = $location.path();
        var postId = window.location.pathname.replace("/post=",'');
        queryCommentsRequest($location, $scope, $http, postId);
        // $scope.counter = 0;
        // $scope.morePage = function() {
        //     $scope.counter++;
        //     queryCommentsRequest($location, $scope, $http, postId);
        //     }
    });

})();

var queryCommentsRequest = function($location, $scope, $http, postId) {
    $http.get("/getpost=" + postId).then(function(resp){
        $scope.comments = resp.data.comments;
        $scope.postData = resp.data.postData;
        $scope.comments.map(function(element){
            var currentTime = new Date();
            var postTime = new Date(element.created_at.replace(' ', 'T'));
            var displayTime = (currentTime - postTime)/1000;
            if (displayTime < 3600) {
                element.created_at = Math.round(displayTime/60) + " minutes ago";
            } else if (displayTime < 86400) {
                element.created_at = Math.round(displayTime/3600) + " hours ago";
            } else {
                element.created_at = Math.round(displayTime/86400) + " days ago";
            }
        })
    });
};
