(function () {

    app.controller('AboutCtrl', function($rootScope, $location)
    {
       $rootScope.activetab = $location.path();
    });
})();
