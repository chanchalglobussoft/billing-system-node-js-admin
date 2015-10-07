MetronicApp.controller('ProfileController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        console.log("Came inside ProfileController");
        var adminValueFromCookie = $cookieStore.get('adminId');
        console.log(adminValueFromCookie);
        $scope.response = {};
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


    MetronicApp.controller('RoleController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
            console.log("Came inside RoleController");
            var adminValueFromCookie = $cookieStore.get('adminId');
            console.log(adminValueFromCookie);
            $scope.response = {};
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


MetronicApp.controller('AdminaccountController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        console.log("Came inside AdminaccountController");
        var adminValueFromCookie = $cookieStore.get('adminId');
        console.log(adminValueFromCookie);
        $scope.response = {};
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

MetronicApp.controller('LogsettingController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        $scope.searchLogs   = '';     // set the default search/filter term
        $scope.sortType = 'date';
        $scope.sortReverse = true;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;


        $scope.paginate = function(value) {
          var begin, end, index;
          begin = ($scope.currentPage - 1) * $scope.numPerPage;
          end = begin + $scope.numPerPage;
          index = $scope.allLogs.indexOf(value);
          return (begin <= index && index < end);
        };
        //Pagination

        $scope.$watch('searchLogs', function () {
            if (!$scope.searchLogs)
            {
                $scope.numPerPage = 10;
            }
            else {
                $scope.numPerPage = 100000; //maximum number of rows in table
            }
        });

        $scope.init = function () {
            $http.get('/log/getStatus/?token=' + $cookies.token).
                    success(function (data) {
//                        console.log("Got the data" + data.Data[0].status);
                        $scope.logStatus = data.Data;
                        if (data.Data[0].status)
                        {
                            $scope.logSwitch = true;
                        }
                        else
                        {
                            $scope.logSwitch = false;
                        }
                    }).error(function () {
                console.log("Error in /log/getStatus/");
            });

            $http.get('/log/count-logs/?token=' + $cookies.token).
                    success(function (data) {
//                        console.log("Count log: " + data.LogCount);
                        $scope.logCount = data.LogCount;
                    }).error(function () {
                console.log("Error in '/log/count-logs/");
            });

            $http.get('/log/get-all-logs/?token=' + $cookies.token).
                    success(function (data) {
                        $scope.allLogs = data.Data;
                        $scope.totalItems = data.Data.length;
                    }).error(function () {
                console.log("Error in '/log/get-all-logs/");
            });
        }

        $scope.change = function () {
//            console.log($scope.logSwitch);
            if ($scope.logSwitch)
            {
                $http.post('/log/setStatus', {status: 1, token: $cookies.token}).
                        success(function (data) {
                            if (data.code === 200)
                            {
                                $scope.logSwitch = true;
                                $scope.init();
                            }
                        });
            } else
            {
                $http.post('/log/setStatus', {status: 0, token: $cookies.token}).
                        success(function (data) {
                            if (data.code === 200)
                            {
                                $scope.logSwitch = false;
                                $scope.init();
                            }
                        });
            }
        };

        $scope.clearAllLogs = function () {
            $http.get('/log/clearLogs/?token=' + $cookies.token).
                    success(function (data) {
                        $scope.clearLogsStatus = data.code;
                        $scope.init();
                    }).error(function () {
                console.log("Error in '/clearLogs/");
            });

        }




    }]);
