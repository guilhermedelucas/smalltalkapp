(function () {

    app.controller('PostCtrl', function($rootScope, $location, $scope, $http, $location)
    {
        $rootScope.activetab = $location.path();
        var postId = window.location.pathname.replace("/post=",'');
        queryCommentsRequest($location, $scope, $http, postId);


        $scope.submitComment = function() {
            $http.post("/addcomment", {
                username: "testingWithoutCookie",
                post_id: postId,
                comment: $scope.newComment
            }).then(function(resp){
                $scope.comments = "";
                $("#display-comments").empty();
                queryCommentsRequest($location, $scope, $http, postId);
                // queryCommentsRequest($location, $scope, $http, postId);
            })
        }

// need to work on the reply button
        $scope.replyButton = function() {
            console.log($("ul id").parent());
            console.log("hello");
        }

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

        var i = 0;
        $scope.comments.forEach(function(findReply){
            if (!findReply.comment_id) {
                $("#display-comments").append('<ul> <ul id="commentid' + findReply.id + '" style="margin-top:15px; margin-left:10px">' + findReply.id + " " + findReply.comment + '</br><button ng-click="replyButton()">Reply</button></ul></ul>')
            }
            if (findReply.comment_id) {
                $scope.comments.forEach(function(findPostEqualToReply){
                    if (findReply.comment_id == findPostEqualToReply.id) {
                        if (findPostEqualToReply.reply) {
                            findPostEqualToReply.reply.push(findReply.comment);
                            $("#commentid" + findReply.comment_id).append('<li id="commentid' + findReply.id + '" style="margin-top:15px; margin-left:30px">' + findReply.comment_id + " " +  findReply.comment + '</li>');
                        }
                        else {
                            findPostEqualToReply.reply = [];
                            findPostEqualToReply.reply[0] = findReply.comment;
                            $("#commentid" + findReply.comment_id).append('<li id="commentid' + findReply.id + '" style="margin-top:15px; margin-left:30px">' + findReply.comment_id + " " + findReply.comment + '</li>');

                        }
                    }

                })
            }
        })
    // console.log($scope.comments);
    })
};
