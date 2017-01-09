(function () {

   app.controller('LoginCtrl', function($rootScope, $scope, $location, $http)
   {
      $rootScope.activetab = $location.path();
      //registration
      $scope.getRegistrationData = function() {

         if (!$scope.register.registrationUsername || !$scope.register.registrationEmail || !$scope.register.registrationPassword || !$scope.register.confirmedPassword){
            $scope.registerInfoRequired = true;
         } else {
            if ($scope.register.registrationPassword !== $scope.register.confirmedPassword) {
               $scope.passwordsDoNotMatch = true;
            } else {
               $scope.passwordsDoNotMatch = undefined;
               var registeredUserData = {
                  username: $scope.register.registrationUsername,
                  email: $scope.register.registrationEmail,
                  password: $scope.register.registrationPassword
               }
               $http.post('/register', registeredUserData).then(function(res){
                  // show err ( if email or password already exists) .. else redirect
                  if(!res.data.err){
                     $location.path('/about');
                  } else {
                     $scope.errEmailOrPassExists = res.data.err;
                     res.config.data = '';
                  }
               })
            }
         }
      }

      //login
      $scope.getLoginData = function() {
          if (!$scope.loginUsername || !$scope.loginPassword) {
              console.log($scope.loginUsername, $scope.loginPassword);
              $scope.loginInfoRequired = true;
          } else {
              var loginUserData = {
                  username: $scope.loginUsername,
                  password: $scope.loginPassword
              }
              console.log(loginUserData);
              $http.post('/login', loginUserData).then(function(res) {
                  //get a "true" value when login info correct and a message when incorrect
                  console.log(res);
                  //check pass on server and getting back response wheather it is valid or not
                  res.config.data = '';
                  $scope.incorrectLoginCredintials = res.data.error;
                  if (!res.data.error) {
                      $location.path("/:0");
                  }
              });
          }
      }

      $scope.logout = function () {
          $scope.username = undefined;
          $http.get('/logout').then(function(res){
              $location.path("/:0");
              $scope.logged = false;
          })
      }


   })
})();
