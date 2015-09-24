MetronicApp.controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', '$window', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, $window, settings) {
        $scope.response = {};
if($cookies.token){
  window.location.href = "#/dashboard.html";

}

        $scope.submit = function () {
            $http.post('/admin/api/auth', {data: $scope.session}).
                    success(function (data, status, headers, config) {
                        if (data.code === 200) {
                            console.log("Successful login");
                            $cookies['token'] = data.token;
                            $cookies['adminId'] = data.admin.adminId;
                            $cookieStore.put('adminId', data.admin.adminId);
//                            console.log("Cookie store"+$cookieStore.get('adminId'));
                            $window.location.href = '#/dashboard.html';
                        } else {
                            alert("Invalid credentials ! Try again !!!");
                        }
                    }).
                    error(function() {
                        console.log("Error in AuthenticationController.");
                    });
        }
    }]);
