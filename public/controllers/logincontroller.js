(function () {

   app.controller('LoginCtrl', function($rootScope, $scope, $location, $http)
   {
      // console.log($location);
      $rootScope.activetab = $location.path();
      //registration
      $scope.getRegistrationData = function() {
         if (!$scope.registerUsername || !$scope.registerEmail || !$scope.registerPassword || !$scope.confirmedPassword){
               $scope.registerFaliure = true;
         } else {
            var registeredUserData = {
               username: $scope.registerUsername,
               email: $scope.registerEmail,
               password: $scope.registerPassword,
            }
            $http.post('/register', registeredUserData).then(function(res){
               res.config.data = '';
               $location.path('/about')
            })
         }
         //check password1 and password2 match
         if ($scope.registerPassword !== $scope.confirmedPassword) {
            $scope.passwordNotMatch = true;
         } else {
            $scope.passwordNotMatch = undefined;
         }
      }

      //login
      $scope.getLoginData = function() {
         if(!$scope.loginUsername || !$scope.loginPassword) {
            $scope.loginFaliure = true;
         } else {
            var loginUserData = {
               username: $scope.loginUsername,
               password: $scope.loginPassword
            }
            $http.post('/login', loginUserData).then(function(res){
               res.config.data = '';
               console.log(res.data); //get a "true" value when login info correct and a message when incorrect
               $scope.invalidCredentials = res.data.message;
               if (!res.data.message){
                  $location.path("/about");
               }
            });
         }
      }
   })
})();
