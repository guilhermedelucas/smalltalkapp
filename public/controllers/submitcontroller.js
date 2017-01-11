(function () {
    app.controller('SubmitCtrl', function($rootScope, $location, $scope, $http)
    {   $rootScope.activetab = $location.path();

        $http.get('submit/checksession').then(function(resp){
            $scope.username = resp.data.username;
        });

        $scope.logged = true;
        $scope.submit = (formTitle, formUrl, formText) => {
            console.log(formTitle, formUrl, formText);
            if (!formTitle && (!formUrl || !formText)) {
                $scope.submiterror = true;
            } else {
                var data = {
                    username: $scope.username,
                    title: formTitle,
                    url: formUrl,
                    text: formText
                };
                $http.post('/submit', data).then(function(resp){
                    $scope.posts = resp.data.posts;
                    $location.path('/:0');
                });
            }
        };
    });
})();
