//ends here


}]);



/* Init global settings and run the app */
BillingApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);



BillingApp.run(function($rootScope, $location, Auth) {

    console.log($location.$$path.substring(0, 8))


    $rootScope.$on('$locationChangeStart', function(previous, next, current) {
        $rootScope.loggedIn = Auth.isLoggedIn();
        if ($rootScope.loggedIn && $location.$$path == "/signup") {
            $location.path('/home');
        } else if (!$rootScope.loggedIn && $location.$$path != "/forgot" && $location.$$path.substring(0, 9) != "/ackcode/" && $location.$$path.substring(0, 6) != "/code/" && $location.$$path.substring(0, 9) != "/message/"&& $location.$$path.substring(0, 7) != "/rcode/"  && $location.$$path.substring(0, 8) != "/errno/" ) {
            $location.path('/signup');
        }
        if ($rootScope.loggedIn && $location.$$path == "/signup") {
            $location.path('/home');
        }

        //var route_object = ($route.routes[$location.path()]).route_object;
        var re = /#\/ackcode\/(.*?)/;
        var h = re.exec($location.absUrl());
        console.log(h);
        Auth.getUser()
            .then(function(data) {
                $rootScope.user = data.data;

                if ($rootScope.user.emailverified == 0 || (h && h.length == 2)) {
                    $location.path('/welcome');
                }
            });
    });

    $rootScope.doLogout = function() {
        Auth.logout();
        $location.path('#/logout');
    };
});


BillingApp.factory('Auth', function($rootScope, $http, $q, AuthToken) {
    var authFactory = {};

    authFactory.login = function(username, password) {

        return $http.post('/api/login', {
                username: username,
                password: password
            })
            .success(function(data) {
                AuthToken.setToken(data.token);
                return data;
            });
    };

    authFactory.logout = function() {
        AuthToken.setToken();
    };

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    authFactory.getUser = function() {
        if (AuthToken.getToken()) {
            return $http.get('/authapi/me');
        } else {
            return $q.reject({
                message: "User has no token"
            });
        }
    };

    return authFactory;
})

BillingApp.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');

    };

    authTokenFactory.setToken = function(token) {

        if (token) {
            $window.localStorage.setItem('token', token);
        } else {

            $window.localStorage.removeItem('token');
        }
    };

    return authTokenFactory;
})

BillingApp.factory('AuthInterceptor', function($q, $location, AuthToken) {
    console.log($location.$$path);
    var interceptorFactory = {};

    interceptorFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    interceptorFactory.responseError = function(response) {
        if (response.status == 403) {
            $location.path('/signup');
        }
        return $q.reject(response);
    };

    return interceptorFactory;

});
BillingApp.factory('mySharedService', function($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});

function ControllerZero($scope, sharedService) {
    $scope.handleClick = function(msg) {
        sharedService.prepForBroadcast(msg);
    };

    $scope.$on('handleBroadcast', function() {
        $scope.message = sharedService.message;
    });
}

ControllerZero.$inject = ['$scope', 'mySharedService'];
