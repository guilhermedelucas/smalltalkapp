(function () {

   app.controller('LoginCtrl', function($rootScope, $scope, $location, $http)
   {
      $rootScope.activetab = $location.path();
      //registration
      $scope.getRegistrationData = function() {
         console.log($scope.registrationPassword)
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
               //redirect $location
            })
         }
         //check pasword matching
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
               var message = res.data.message;
               //redirect $location
            });
         }
      }
   })
})();
