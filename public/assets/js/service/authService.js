
angular
    .module('authService', [])
    .factory('Auth', function($http, $q, AuthToken){
        var authFactory = {};



        authFactory.logout = function(){
            AuthToken.setToken();
        };

        authFactory.isLoggedIn = function(callback){
//            console.log('inside isLoggedIn');
            if(AuthToken.getToken()){
                callback(true);
//                return true;
            } else {
                callback(false);
//                return false;
            }
        };

        authFactory.getUser = function(callback){
//            console.log('authFactory.getUser');
            var token = AuthToken.getToken();
//            console.log('token : '+token);
            if(token){
//                $http.defaults.headers.common['token'] = token;
//                console.log('1 : '+token);
                $http.post('/authapi/me').success(function(response) {
//                $http.post('/api/me', {'token':AuthToken.getToken()} ).success(function(response) {
                    callback(response);
                });
/**/

/**/
            } else {
                return $q.reject({ message: "User has no token"});
            }
        };

        return authFactory;
    })

    .factory('AuthToken', function($window){
        var authTokenFactory = {};

        authTokenFactory.getToken = function(){
            return $window.localStorage.getItem('token');
        };

        authTokenFactory.setToken = function(token){

            if(token){
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })

    .factory('AuthInterceptor', function($q, $location, AuthToken){
        var interceptorFactory = {};

        interceptorFactory.request = function(config){
            var token = AuthToken.getToken();

            if(token){
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        interceptorFactory.responseError = function(response){
            if(response.status == 403){
                $location.path('/login');
            }
            return $q.reject(response);
        };

        return interceptorFactory;

    });

