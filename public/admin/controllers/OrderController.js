MetronicApp.controller('CreateorderController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {

        $scope.response = {};
        $scope.response.clientId = 0;
        $scope.response.productId = 0;

        $scope.name = ''; // set the default search/filter term
        $scope.product = '';

        $scope.currentPageClient = 1;
        $scope.currentPageProducts = 1;
        $scope.numPerPage = 10;

        $scope.paginateClients = function (value) {
            var begin, end, index;
            begin = ($scope.currentPageClient - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.client.indexOf(value);
            return (begin <= index && index < end);
        };

        $scope.paginateProducts = function (value) {
            var begin, end, index;
            begin = ($scope.currentPageProducts - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.product.indexOf(value);
            return (begin <= index && index < end);
        };

        $scope.$watch('name', function () {
            if (!$scope.name)
            {
                $scope.numPerPage = 10;
            }
            else {
                $scope.numPerPage = 100000; //maximum number of rows in table
            }
        });

        $scope.$watch('product', function () {
            if (!$scope.product)
            {
                $scope.numPerPage = 10;
            }
            else {
                $scope.numPerPage = 100000; //maximum number of rows in table
            }
        });


        $scope.init = function () {


                      $scope.getAllProducts = function () {
                          $http.post('/admin/api/get-all-products', {
                              token: $cookies.token
                          }).
                                  success(function (data, status, headers, config) {
                                      $scope.response.product = data.Data;
                                      $scope.totalProductsItems = data.Data.length;
                                      $scope.paginateProducts();
//                                      console.log(data.Data)
                                  }).
                                  error(function (data, status, headers, config) {
                                  });
                      }

                      $scope.getAllClients = function () {
                          $http.post('/admin/api/get-all-clients', {
                              token: $cookies.token
                          }).
                                  success(function (data, status, headers, config) {
                                      $scope.response.client = data.Data;
                                      $scope.totalClientItems = data.Data.length;
                                      $scope.paginateClients();
                                  }).
                                  error(function (data, status, headers, config) {
                                  });
                      }

            // $scope.keyPress = function (keyCode) {
            //
            //     $http.post('/admin/api/select-client', {
            //         data: $scope.name,
            //         token: $cookies.token
            //     }).
            //             success(function (data, status, headers, config) {
            //                 $scope.response.client = data.Data;
            //                 $scope.totalClientItems = data.Data.length;
            //                 $scope.paginateClients();
            //                 console.log(data.Data)
            //             }).
            //             error(function (data, status, headers, config) {
            //
            //             });
            //
            //
            //
            //
            //     console.log($scope.name)
            // }

            $scope.searchproduct = function () {
                $http.post('/admin/api/select-product', {
                    product: $scope.product,
                    token: $cookies.token
                }).
                        success(function (data, status, headers, config) {
                            $scope.response.product = data.Data;
                            $scope.totalProductsItems = data.Data.length;
                            $scope.paginateProducts();
                        }).
                        error(function (data, status, headers, config) {
                        });
            }


            $scope.add = function () {
                //with this function Admin can add a client to whom billing is to done
                var selected_client = JSON.parse($scope.response.myvalue);//parsing string to json
                $scope.response.clientId = selected_client.clientId;
                $scope.response.fname = selected_client.fname;
                $scope.response.lname = selected_client.lname;
            }


            $scope.addproduct = function () {
                //with this function Admin can add a client to whome billing is to done
                var product = JSON.parse($scope.response.selectProduct);//parsing string to json
                $scope.response.productId = product.productId;
                $scope.response.productName = product.productName;
                $scope.response.price = product.price;
                $scope.response.productDescription = product.description;
            }



            $scope.pay = function () {
                if ($scope.response.productId == 4) {
                    window.location.href = "#/reg-domain.html";
                } else {
                    $http.post('/admin/api/deduct-balance', {
                        clientId: $scope.response.clientId,
                        amount: $scope.response.price,
                        token: $cookies.token
                    }).
                            success(function (data, status, headers, config) {
                                if (data.code == 200) {
                                    $http.post('/admin/api/order-details', {
                                        clientId: $scope.response.clientId,
                                        amount: $scope.response.price,
                                        promocodes: "Null",
                                        description: "Payment Towards" + $scope.response.productName,
                                        productId: $scope.response.productId,
                                        datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                                        date: moment().format("YYYY-MM-DD"),
                                        paymentStatus: 1,
                                        billingCycle: $scope.duration,
                                        orderStatus: 2,
                                        token: $cookies.token
                                    }).
                                            success(function (data, status, headers, config) {
                                                console.log(data);
                                                if (data.code == 200) {
                                                    window.location.href = "#/invoice.html?invoiceId=" + data.invoiceId;
                                                }
                                            })
                                }

                            })
                }
            }
            $scope.withoutpayment = function () {
                // console.log($scope.duration);
                if ($scope.response.productId == 4) {
                    window.location.href = "#/reg-domain.html";
                } else {
                    $http.post('/admin/api/order-details', {
                        clientId: $scope.response.clientId,
                        amount: $scope.response.price,
                        promocodes: "Null",
                        description: "Payment Towards" + $scope.response.productName,
                        productId: $scope.response.productId,
                        datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        date: moment().format("YYYY-MM-DD"),
                        paymentStatus: 3,
                        orderStatus: 1,
                        billingCycle: $scope.duration,
                        token: $cookies.token
                    }).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                if (data.code == 200) {
                                    window.location.href = "#/invoice.html?invoiceId=" + data.invoiceId;
                                }
                            })
                }

            }
        }




    }]);
