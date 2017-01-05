(function () {
    app.controller('SubmitCtrl', function($rootScope, $location, $scope, $http)
    {   $rootScope.activetab = $location.path();
        $scope.submit = (formTitle, formUrl, formText) => {
            if (!formTitle || !formUrl || !formText) {
                $scope.submiterror =true;
            } else {
                var data = {
                    title: formTitle,
                    url: formUrl,
                    text: formText
                };
                $http.post('/submit', data).then(function(resp){
                    $scope.posts = resp.data.posts;
                    console.log($scope.posts);
                    $location.path('/home');
                });
            }
        };
    });
})();
