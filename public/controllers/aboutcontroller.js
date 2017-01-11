(function() {
    app.controller('AboutCtrl', function($rootScope, $scope, $location, $http) {
        $rootScope.activetab = $location.path();
        $http.get('/profile').then(function(resp) {
                $scope.email = resp.data.userData[0].email;
                $scope.username = resp.data.session;
                $scope.logged = true;
            })
            //username field
        $scope.userCheckingNewUsername = function(username) {
            if ($scope.username === username) {
                $scope.showUsernameCheckButton = false;
                $scope.sameUsername = true; //get back to this later
            } else {
                $scope.showUsernameCheckButton = true;
            }
        }
        $scope.attemptToUpdateUsername = function(username) {
                $http.post('/profile/username', {
                    username: username
                }).then(function(res) {
                    console.log(res);
                    if (res.data.usernameExists === false) {
                        $scope.showUsernameCheckButton = false;
                        $scope.updateUsernameFailed = false;
                        $scope.updateUsernameSuccess = true;
                    } else if (res.data.usernameExists === true) {
                        $scope.showUsernameCheckButton = false;
                        $scope.updateUsernameSuccess = false;
                        $scope.updateUsernameFailed = true;
                    }
                })
            }
            //email field
        $scope.userCheckingNewEmail = function(email) {
            if ($scope.email === email) {
                $scope.showEmailCheckButton = false;
                $scope.sameEmail = true; //get back to this later
            } else {
                $scope.showEmailCheckButton = true;
            }
        }
        $scope.attemptToUpdateEmail = function(email) {
                $http.post('/profile/email', {
                    email: email
                }).then(function(res) {
                    console.log(res);
                    if (res.data.emailExists === false) {
                        $scope.showEmailCheckButton = false;
                        $scope.updateEmailFailed = false;
                        $scope.updateEmailSuccess = true;
                    } else if (res.data.emailExists === true) {
                        $scope.showEmailCheckButton = false;
                        $scope.updateEmailSuccess = false;
                        $scope.updateEmailFailed = true;
                    }
                })
            }
            //password field
        $scope.userCheckingNewPassword = function(password) {
            if ($scope.password === password) {
                $scope.showPasswordCheckButton = false;
                $scope.samePassword = true; //get back to this later
            } else {
                $scope.showPasswordCheckButton = true;
            }
        }

        $scope.attemptToUpdatePass = function(password) {
            $http.post('/profile/password', {
                password: password
            }).then(function(res) {
                console.log(res);
                // if (res.data.emailExists === false){
                //    $scope.showEmailCheckButton = false;
                //    $scope.updateEmailFailed = false;
                //    $scope.updateEmailSuccess = true;
                // } else if (res.data.emailExists === true){
                //    $scope.showEmailCheckButton = false;
                //    $scope.updateEmailSuccess = false;
                //    $scope.updateEmailFailed = true;
                // }
            })
        }

    })
})();
