MetronicApp.controller('Mycontroller', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore','settings', function ($rootScope, $scope, $http, $cookies, $cookieStore , settings) {
         console.log("Came inside Mycontroller");
         var adminValueFromCookie = $cookieStore.get('adminId');
         console.log("Got this value from $cookieStore"+adminValueFromCookie);
//        $scope.response = {};


//        $scope.submit = function () {
//            $http.post('/admin/api/auth', {data: $scope.session}).
//                    success(function (data, status, headers, config) {
//                        if (data.code === 200) {
//                            console.log("Successful login");
//                            $cookies['token'] = data.token;
//                            $cookieStore.put('adminId', data.admin.adminId);
//                            $window.location.href = '#/dashboard.html';
//                        } else {
//                            alert("Invalid credentails ! Try again !!!");
//                        }
//                    }).
//                    error(function() {
//                        console.log("Error in AuthenticationController.");
//                    });
//        }



    }]);
