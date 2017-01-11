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
                     $location.path('/');
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

      $scope.facebookLogin = function() {
          FB.login(function(res) {
              if (res.status === 'connected') {
                  datarequest()
              } else {
                  //need to notify
                  console.log('loginerror');
              }
          }),{scope: 'public_profile,email'};
          function datarequest() {
              FB.api('me?fields=name,email', function(res){
                  var data = {
                      email: res.email,
                      name: res.name
                  };
                  console.log(data);
                  $http.post('/sociallogin', data).then(function(res){
                      res.config.data = '';
                      if (!res.data.error){
                          //need to store username
                          $scope.username = res.data.username;
                          $scope.logged = true;
                          $location.path("/about");
                      }
                  });
              });
          }
      };

      $scope.googlePlusLogin = function() {
    //       console.log('runn');
    //       gapi.load('auth2', function(){
    //         auth2 = gapi.auth2.init({
    //           client_id: '11202645552-r7locp23o4sb4k70skpsnk8mnk9uviid.apps.googleusercontent.com',
    //           cookiepolicy: 'single_host_origin',
    //       })
    //   }).then(function(res){
    //       console.log(res);
    //   });
    gapi.auth2.init({
              client_id: '11202645552-r7locp23o4sb4k70skpsnk8mnk9uviid.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
          }).then(function(res){
          console.log(res);
      });
            // function attachSignin() {
            //     auth2(
            //         function(googleUser) {
            //             console.log(googleUser.getBasicProfile());
            //         }, function(error) {
            //             alert(JSON.stringify(error, undefined, 2));
            //         });
            // }
            // attachSignin();


        //   function datarequest() {
        //       FB.api('me?fields=name,email', function(res){
        //           var data = {
        //               email: res.email,
        //               name: res.name
        //           };
        //           $http.post('/sociallogin', data).then(function(res){
        //               res.config.data = '';
        //               if (!res.data.error){
        //                   //need to store username
        //                   $location.path("/about");
        //               }
        //           });
        //       });
        //   }
      };


   });
})();
