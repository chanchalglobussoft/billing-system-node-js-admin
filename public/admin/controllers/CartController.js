MetronicApp.controller('CartController', ['$rootScope', '$scope', '$http', '$cookies', '$location', 'settings', function ($rootScope, $scope, $http, $cookies, $location, settings) {

        $scope.response = {};

        $scope.name = ''; // set the default search/filter term
        $scope.sortReverse = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.client.indexOf(value);
            return (begin <= index && index < end);
        };
        //Pagination


        $scope.$watch('name', function () {
            if (!$scope.name)
            {
                $scope.numPerPage = 10;
            }
            else {
                $scope.numPerPage = 100000; //maximum number of rows in table
            }
        });



        $scope.init = function () {
            $scope.response.duration = $location.$$search.years;
            $scope.response.domainName = $location.$$search.domainName;
            $scope.response.productType = $location.$$search.productType;
            $scope.response.productId = 4;
            $scope.response.pricePerYear = $location.$$search.pricePerYear;
            $scope.response.totalprice = $scope.response.pricePerYear * $scope.response.duration;
            $scope.response.clientId = 0;

            $scope.keyPress = function (keyCode) {
                $http.post('/admin/api/select-client', {
                    data: $scope.name,
                    token: $cookies.token
                }).
                        success(function (data, status, headers, config) {
                            $scope.response.client = data.Data;
                            $scope.totalItems = data.Data.length;
                            $scope.paginate();
                            console.log(data.Data)
                        }).
                        error(function (data, status, headers, config) {
                        });
                console.log($scope.name)
            }

            $scope.getAllClients = function () {
                $http.post('/admin/api/get-all-clients', {
                    token: $cookies.token
                }).
                        success(function (data, status, headers, config) {
                            $scope.response.client = data.Data;
                            $scope.totalItems = data.Data.length;
                            $scope.paginate();
//                            console.log(data.Data)
                        }).
                        error(function (data, status, headers, config) {
                        });
                console.log($scope.name)
            }


            $scope.add = function () {

                //with this function Admin can add a client to whome billing is to done
                var selected_client = JSON.parse($scope.response.myvalue);//parsing string to json
                $scope.response.clientId = selected_client.clientId;
                $scope.response.fname = selected_client.fname;
                $scope.response.lname = selected_client.lname;

                $scope.pay = function () {
                    $http.post('/admin/api/deduct-balance', {
                        clientId: $scope.response.clientId,
                        amount: $scope.response.totalprice,
                        token: $cookies.token
                    }).
                            success(function (data, status, headers, config) {
//                                  console.log(data);
                                if (data.code == 200) {
                                    $http.post('/admin/api/order-details', {
                                        clientId: $scope.response.clientId,
                                        amount: $scope.response.totalprice,
                                        promocodes: "Null",
                                        description: $scope.response.domainName,
                                        productId: $scope.response.productId,
                                        datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                                        date: moment().format("YYYY-MM-DD"),
                                        paymentStatus: 1,
                                        billingCycle: $scope.response.duration,
                                        orderStatus: 2,
                                        token: $cookies.token
                                    }).
                                            success(function (data, status, headers, config) {
                                                console.log(data);
                                                if (data.code == 200) {
                                                    window.location.href = "#/domain-reg.html?domainName=" + $scope.response.domainName + "&years=" + $scope.response.duration + "&clientId=" + $scope.response.clientId + "&invoiceId=" + data.invoiceId;
                                                }
                                                console.log(data.Data);
                                            })
                                }
                                console.log(data.Data);
                            })
                }
            }
        }
    }]);
