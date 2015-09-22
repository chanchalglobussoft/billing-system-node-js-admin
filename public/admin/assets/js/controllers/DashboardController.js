MetronicApp.controller('DashboardController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {

        $scope.countries = {};
        $scope.currencies = {};
        $scope.securityQuestions = {};


        $http.post('api/country/get-only-names', {
            token: $cookies.token
        }).success(function (data) {
            console.log(data);
            $scope.countries = data.Data;
        }).error(function (data) {
            console.log("Error in /country/get-all-data: " + data);
        });

        $http.post('api/country/get-only-currencies', {
            token: $cookies.token
        }).success(function (data) {
            console.log(data);
            $scope.currencies = data.Data;
        }).error(function (data) {
            console.log("Error in /country/get-all-data: " + data);
        });

        $http.post('api/security-questions/get-only-questions', {
            token: $cookies.token
        }).success(function (data) {
            console.log(data);
            $scope.securityQuestions = data.Data;
        }).error(function (data) {
            console.log("Error in /security-questions/get-only-questions: " + data);
        });

        $scope.selectedCountry = function (a)
        {
            $scope.session.currencyID = $scope.currencies.id_countries = a;
        }
        $scope.selectedSecurityQuestion = function (a)
        {
            console.log(a);
        }

        $scope.paymentMethods = {
                               1: "Debit Card",
                               2: "Credit Card",
                               3: "Paypal",
                               4: "Bitcoin",
                               5: "Venmo",
                               6: "Apple Pay",
                               7: "Android Pay",
                               8: "Other method"
        }

        $scope.init = function () {




            // /country/get-all-data


//            $scope.data = {
//                1: "group1",
//                2: "group2",
//                3: "group3"
//
//            };
            $scope.status = {
                1: "Active",
                2: "Inactive",
                3: "Dormant"

            };

        }

        $scope.submit = function () {


            console.log($scope.session);
            if ($scope.session.eMail && $scope.session.phone && $scope.session.fName) {


                $http.post('/addclient', {
                    data: $scope.session,
                    token: $cookies.token,
                    date: moment().format('YYYY-MM-DD'),
                    source: "SignUp By Client"




                }).
                        success(function (data, status, headers, config) {
                            console.log(data);
                            if (data.code == 200) {
                                registrationSuccess();
                                $scope.session ='';
                            } else {
                                emailAlreadyExits();
                            }
                        }).
                        error(function (data, status, headers, config) {
                        });
            } else {
                alert("Please Enter Valid Data")
            }
        }
    }]);



MetronicApp.controller('ManageOrderController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        $scope.response = {};


                $scope.searchManageOrders = ''; // set the default search/filter term
                $scope.sortType = 'date';
                $scope.sortReverse = true;

                //Pagination
                $scope.currentPage = 1;
                $scope.numPerPage = 10;

                $scope.paginate = function (value) {
                    var begin, end, index;
                    begin = ($scope.currentPage - 1) * $scope.numPerPage;
                    end = begin + $scope.numPerPage;
                    index = $scope.response.data.indexOf(value);
                    return (begin <= index && index < end);
                };


        $scope.$watch('searchManageOrders', function(term) {
          if(!$scope.searchManageOrders)
          {
            $scope.numPerPage = 10;
          }
          else {
              $scope.numPerPage = 100000; //maximum number of rows in table
          }
        });

        $scope.ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        };

        $scope.init = function () {

          $scope.dateSwitch = false;
          $scope.daysAgoSwitch = false;

          $scope.response.paymentGateway = {
            1: "Debit Card",
            2: "Credit Card",
            3: "Paypal",
            4: "Bitcoin",
            5: "Venmo",
            6: "Apple Pay",
            7: "Android Pay",
            8: "Other method"
          };

          $scope.response.status = {
              1: "Successful",
              2: "Failed",
              3: "Pending",
              4: "Incomplete"

          };

            $http.post('/api/latest-findorders', {data: $scope.session, token: $cookies.token}).
                    success(function (data, status, headers, config) {


                        if (data.Data.length > 0) {
                            $scope.response.data = data.Data;
                            $scope.totalItems = data.Data.length;

                            $timeout(function () {

                                //$("#example_paginate").hide();
                                var rowCount = $("#sample_1 tr").length;
                                console.log("Row count value is" + rowCount);
                                if (rowCount >= 0) {
                                    console.log("Entered into Sorting");
                                    TableAdvanced.init();
                                }
                            }, 200);

                        } else {
                            alert("No Results Found ");
                        }
                        console.log($scope.response.data);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });



        }

        $scope.submit = function () {
            //console.log($scope.session);
            if ($scope.session) {

                $http.post('/api/findorders', {data: $scope.session, dateswitch: $scope.dateSwitch, dayswitch: $scope.daysAgoSwitch, token: $cookies.token}).
                        success(function (data, status, headers, config) {

                            if (data.Data.length > 0) {
                                $scope.response.data = data.Data;
                                $scope.totalItems = data.Data.length;

                            } else {
                                noResults();
                                //alert("No Results Found ");
                            }
                            console.log($scope.response.data);
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });

            } else {
                alert("Please feed fome data to search");
            }
        }


    }]);




MetronicApp.controller('billFilterController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        $scope.response = {};
        $scope.session = {};

        $scope.dateSwitch = false;
        $scope.daysAgoSwitch = false;
        $scope.session.datesrange = "";
        $scope.session.daysAgo = "";
//            $scope.session.datesrange = {startDate: null, endDate: null};

        $scope.response.status = {
            //none,
//            0:"None",
            1: "Successful",
            2: "Failed",
            3: "Pending",
            4: "Incomplete"

        };

        $scope.searchTransactions = ''; // set the default search/filter term
        $scope.sortType = 'tDate';
        $scope.sortReverse = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;

        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.data.indexOf(value);
            return (begin <= index && index < end);
        };



        $scope.$watch('searchTransactions', function(term) {
          if(!$scope.searchTransactions)
          {
            $scope.numPerPage = 10;
          }
          else {
              $scope.numPerPage = 100000; //maximum number of rows in table
          }
        });

        $scope.response.paymentGateway = {
            //none,
            0: "Wallet",
            1: "Pay Pal",
            2: "BitCoin",
        };

        $scope.ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        };

        $scope.init = function () {

            $http.post('/api/latest-transations', {token: $cookies.token}).
                    success(function (data, status, headers, config) {
                        if (data.Data.length > 0) {
                            $scope.response.data = data.Data;
                            $scope.totalItems = data.Data.length;
                        } else {
//                            alert("No Results Found ");
                        }
//                        console.log($scope.response.data);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


            $scope.submit = function () {
//                console.log("dateSwitch" + $scope.dateSwitch);
//                console.log("daySwitch" + $scope.daysAgoSwitch);
//                console.log("On sbumit" + JSON.stringify($scope.session));

                if ($scope.session) {
                    $http.post('/api/findtransations', {data: $scope.session, dateswitch: $scope.dateSwitch, dayswitch: $scope.daysAgoSwitch, token: $cookies.token}).
                            success(function (data, status, headers, config) {
//                                console.log("Inside controller " + JSON.stringify(data));
                                if (data.Data.length > 0) {
                                    $scope.response.data = data.Data;
                                    $scope.totalItems = data.Data.length;
                                } else {
                                    noTransactions();
                                }
//                                console.log($scope.response.data);

                            }).
                            error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });
                } else {
                    alert("Please feed fome data to search")
                }
            }
        }


    }]);



MetronicApp.controller('BillingInvoiceController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        $scope.response = {};
        $scope.session = {};

        $scope.searchInvoices = ''; // set the default search/filter term
        $scope.sortType = 'tDate';
        $scope.sortReverse = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;

        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.data.indexOf(value);
            return (begin <= index && index < end);
        };


$scope.$watch('searchInvoices', function(term) {
  if(!$scope.searchInvoices)
  {
    $scope.numPerPage = 10;
  }
  else {
      $scope.numPerPage = 100000; //maximum number of rows in table
  }
});


        $scope.ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        };
        //console.log("jdfg");
        $scope.init = function () {
            $scope.dateSwitch = false;
            $scope.daysAgoSwitch = false;
            $scope.session.datesrange = "";
            $scope.session.daysAgo = "";

            $scope.response.paymentGateway = {
                0: "Wallet",
                1: "Pay Pal",
                2: "BitCoin",
            };
            $scope.response.status = {
                1: "Successful",
                2: "Failed",
                3: "Pending",
                4: "Incomplete"

            };


            $http.post('/api/latest-findinvoices', {token: $cookies.token}).
                    success(function (data, status, headers, config) {
                        if (data.Data.length > 0) {
                            $scope.response.data = data.Data;
                            $scope.response.todays = data.Todays;
                            $scope.totalItems = data.Data.length;
                        } else {
//                            alert("No Results Found ");
                        }
                        console.log($scope.response.data);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

        }

        $scope.submit = function () {
            console.log($scope.session);
            if ($scope.session) {

                $http.post('/api/findinvoices', {data: $scope.session, dateswitch: $scope.dateSwitch, dayswitch: $scope.daysAgoSwitch, token: $cookies.token}).
                        success(function (data, status, headers, config) {
                            if (data.Data.length > 0) {
                                $scope.response.data = data.Data;
                                $scope.totalItems = data.Data.length;
                            } else {
                                noInvoices();
                            }
                            console.log($scope.response.data);
                            //console.log(data.code);
                            // console.log("hello");
                            // this callback will be called asynchronously
                            // when the response is available
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
            } else {
                alert("Please feed fome data to search")
            }

        }


    }]);
