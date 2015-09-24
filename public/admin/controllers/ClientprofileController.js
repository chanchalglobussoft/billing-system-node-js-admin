MetronicApp.controller('ClientsProfileController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', '$location', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, $location, settings) {

        $scope.response = {};
        var clientId = $location.$$search.clientId;
        $scope.init = function () {

            $http.post('/admin/api/client-profile', {
                clientId: clientId,
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {

                        $scope.response.profile = data.Data[0];


                        console.log($scope.response.profile);



                    });

            $http.get('api/tickets/get-product-services/' + clientId + '/?token=' + $cookies.token).
                    success(function (data) {
                        $scope.productServices = data.Data;
                    }).
                    error(function () {
                        console.log("Something went wrong in api/tickets/get-product-services/")
                    });


        }







    }]);
