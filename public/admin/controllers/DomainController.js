/* Setup general page controller */
MetronicApp.controller('DomainController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        $scope.response = {};



        $scope.init = function () {

            $http.post('/admin/api/get-registered-domains', {//get all domains registered
                data: $scope.session,
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {
                        if (data.data.ApiResponse.Status == "OK") {
                            $scope.response.data = data.data.ApiResponse.CommandResponse.DomainGetListResult.Domain;



                            $timeout(function () {

                                //$("#example_paginate").hide();
                                var rowCount = $("#sample_1 tr").length;
                                console.log("Row count value is" + rowCount);
                                if (rowCount >= 0) {
                                    console.log("Entered into Sorting");
                                    TableAdvanced.init();
                                }
                            }, 200);
                            //  console.log(  $scope.response.data);
                        }
                    });

            /*--------------------------------------------*/


            $http.post('/admin/api/namecheap-balance', {//get account balance from namechep
                token: $cookies.token
            }).
                    success(function (data, status) {
                        if (data.data.ApiResponse.Status == "OK") {

                            $scope.response.namecheap = data.data.ApiResponse.CommandResponse.UserGetBalancesResult;
                            console.log(data.data.ApiResponse.CommandResponse.UserGetBalancesResult);

                        }


                    })


        }




        // console.log($scope.session);
        // //alert($scope.submitForm);
        // if ($scope.session) {
        //     $http.post('/admin/api/finddomain', {
        //         data: $scope.session,
        //         token: $cookies.token
        //     }).
        //     success(function(data, status, headers, config) {
        //
        //         if (data.Data.length > 0) {
        //             $scope.response.data = data.Data;
        //         } else {
        //             alert("No Results Found");
        //         }
        //
        //     }).
        //     error(function(data, status, headers, config) {
        //
        //     });
        //
        // } else {
        //     alert("Please Feed Some Data");
        // }






        //  $scope.master = {firstName:"John", lastName:"Doe"};
        // $scope.reset = function() {
        //     $scope.user = angular.copy($scope.master);
        // };
        // $scope.reset();
    }]);




MetronicApp.controller('CancelRequestController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {

        var adminValueFromCookie = $cookieStore.get('adminId');
        console.log("Got this value from cookie" + adminValueFromCookie);


        $scope.response = {};

        $scope.searchPendingRequests = '';     // set the default search/filter term
        $scope.searchacceptedRequests = '';     // set the default search/filter term

        $scope.sortType1 = 'reqDatepending';
        $scope.sortType = 'acceptedDateaccepted';
        $scope.sortReverse1 = true;
        $scope.sortReverse = true;



        $scope.init = function () {


//            $http.get('/admin/api/getcancellations/?token=' + $cookies.token).
//                    success(function (data, status, headers, config) {
//                        // console.log($scope.response.data);
//                        $scope.response.data = data.Data;
//                        console.log($scope.response.data);
//
//                    }).
//                    error(function (data, status, headers, config) {
//                        // called asynchronously if an error occurs
//                        // or server returns response with an error status.
//                    });

            $http.post('/admin/api/get-pending-cancellations',
                    {
                        adminId: adminValueFromCookie,
                        token: $cookies.token
                    }).
                    success(function (data) {
                        $scope.response.pending = data.Data;
                        $scope.pendingReqCount = data.Data.length;
                    });

            $http.post('/admin/api/get-accepted-cancellations',
                    {
                        adminId: adminValueFromCookie,
                        token: $cookies.token
                    }).
                    success(function (data) {
                        $scope.response.accepted = data.Data;
                        $scope.acceptedReqCount = data.Data.length;
                    });

        }

        $scope.updateCancellationStatus = function (a, b) {
            var action = a;
            var cancellationId = b;
            $http.post('/admin/api/updatedcancellations',
                    {
                        action: action,
                        cancellationId: cancellationId,
                        adminId: adminValueFromCookie,
                        token: $cookies.token
                    }).
                    success(function () {
                        $scope.init();
                    });
        }


    }]);




MetronicApp.controller('RegDomainController', ['$rootScope', '$scope', '$http', '$cookies', '$modal', '$log', 'settings', function ($rootScope, $scope, $http, $cookies, $modal, $log, settings) {
        //alert("hello");
        $scope.searching = false;
        $scope.response = {};

        // $scope.keyPress = function(keyCode) {
        //
        //
        // }

        $scope.init = function () {


            $http.post('/admin/api/get-percentage-increase', {
                token: $cookies.token, //send token in every request

            }).
                    success(function (data, status, headers, config) {
                        //   console.log(data);
                        $scope.response.percentage = data.Data[0].percentage;
                        //console.log($scope.response.percentage);

                    });
        }
        $scope.calculate = function (data, perc) { //calculating %change
            //console.log(data);
            for (var i = 0; i < data.length; i++) {
                //console.log(data[i].MyPrice);
                data[i].YourPrice = parseFloat(data[i].YourPrice) + parseFloat((data[i].YourPrice * perc / 100).toFixed(2));
            }


            return data;
        }



        $scope.keyPress = function () { //getting data from view on keypress
            //  console.log($scope.session.domain);
            var name = $scope.session.domain.replace('www.', '').trim(); //namechep api do not support www
            //console.log(name);
            $scope.loading = true;
            $http.post('/admin/api/getDomain', {
                token: $cookies.token, //send token in every request
                name: name
            }).
                    success(function (data, status, headers, config) {

                        // console.log(data);
                        // console.log($scope.response.data);
                        var obj = data.data;
                        //  var domainInfo = ;
                        var mydata = [];
                        $scope.response.domainInfo = data.domainInfo; //here domain information is coming from mongo db it contains domin pricing structure
                        $scope.response.dominAvailablity = obj.ApiResponse.CommandResponse.DomainCheckResult; //we are geting this data from namechep api it shows a domain is avilable or not
                        console.log($scope.response.domainInfo);
                        for (var i = 0; i < data.domainInfo.length; i++) { //extracting required data from both objects and storing it in a single array .
                            var a = $scope.calculate(data.domainInfo[i].Price, $scope.response.percentage);

                            //  console.log(a);

                            // console.log(obj.ApiResponse.CommandResponse.DomainCheckResult[i].Domain);
                            var b = parseFloat(data.domainInfo[i].Price[0].Price) + parseFloat((data.domainInfo[i].Price[0].Price * $scope.response.percentage / 100).toFixed(2));

                            mydata[i] = {
                                domain: obj.ApiResponse.CommandResponse.DomainCheckResult[i].Domain, //geting domin names
                                status: obj.ApiResponse.CommandResponse.DomainCheckResult[i].Available, //getting availablity status
                                price: b, //price
                                minDuration: data.domainInfo[i].Price[0].Duration, //duration is a array
                                maxDuration: data.domainInfo[i].Price[data.domainInfo[i].Price.length - 1].Duration, //getting max duration from last element of duration array.
                                pricingDetails: a, //price structure is a array
                                tld: data.domainInfo[i].Name //tld name

                            }
                            //                            console.log(mydata[i]);

                        }
                        $scope.response.info = mydata;
                        //   console.log(mydata);

                        if (obj.ApiResponse.Status == "OK") {
                            if (obj.ApiResponse.CommandResponse.DomainCheckResult[0].Available == false) {

                                $scope.response.result = 0;
                            } else {
                                $scope.response.result = 1;
                            }

                        } else {
                            $scope.response.result = 0;
                        }
                        //  console.log(obj.ApiResponse.Status);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    })
                    .finally(function () {
                        // Hide loading spinner whether our call succeeded or failed.
                        $scope.loading = false;
                    });


        } //submit function ends here

        $scope.orderDomain = function (data, duration, price) {
            console.log(data);
            console.log(duration);

            window.location.href = "#/cart.html?domainName=" + data + "&years=" + duration + "&productType=Domain&&pricePerYear=" + price;

            // window.location.href = "#/domain-reg.html?domainName=" + data + "&years=" + duration;

        }



    }]);




MetronicApp.controller('RegistertldController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        //alert("hello");

        //to increase % of price
        $scope.increase = function (data) {
            console.log(data);
            if (data) {
                $http.post('/admin/api/change-tld-price', {
                    token: $cookies.token, //send token in every request
                    value: data

                }).
                        success(function (data, status, headers, config) {
                            //  console.log(data);
                            $scope.init();

                        }).
                        error(function (data, status, headers, config) {

                        });
            } else {

                alert("Enter A Number");
            }
        }

        $scope.response = {};
        //to show data on datatable
        $scope.init = function () {


            $http.post('/admin/api/get-percentage-increase', {
                token: $cookies.token, //send token in every request

            }).
                    success(function (data, status, headers, config) {
                        //   console.log(data);
                        $scope.response.percentage = data.Data[0].percentage;
                        //console.log($scope.response.percentage);

                    });


            $http.post('/admin/api/get-tld-domain', {
                token: $cookies.token, //send token in every request

            }).
                    success(function (data, status, headers, config) {
                        // console.log($scope.response.data);
                        //  $scope.response.data = data.data;
                        $scope.response.data = $scope.calculate(data.data, $scope.response.percentage); //refer ther function for calculating dynamic price change

                        //  console.log($scope.response.data);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
        }


        $scope.calculate = function (data, perc) { //calculating %change

            for (var i = 0; i < data.length; i++) {
                data[i].MyPrice = parseFloat(data[i].MyPrice) + parseFloat((data[i].MyPrice * perc / 100).toFixed(2));

            }

            //console.log(data.length);
            //  console.log(perc);

            return data;
        }


    }]);
MetronicApp.controller('DomainRegistration', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function ($rootScope, $scope, $http, $cookies, settings, $location) {
        $scope.response = {};
        $scope.session = {};

        $scope.init = function () {

// console.log(date_time);
            $scope.response.err = 0;
            //console.log("hello world");
            $scope.response.duration = $location.$$search.years;



            $scope.response.domainName = $location.$$search.domainName;

            $scope.response.clientId = $location.$$search.clientId;
            $scope.response.invoiceId = $location.$$search.invoiceId;

            //$location.$$search.clientId;

            var date_time = moment().format('YYYY-MM-DD, h:mm:ss');
            var productId = 1;
            var transId = 5;
            var description = "Domain#" + $location.$$search.domainName + "Duration#" + $scope.response.duration;


            // $http.post('/admin/api/create-order',{
            //   token:$cookies.token,
            //   clientId:$scope.response.clientId,
            //   description:description,
            //   tarnsId:transId,
            //   productId:productId,
            //   date:date_time
            // })
            // success(function(data, status, headers, config) {
            //  console.log(data);
            // })





            $http.get('/admin/api/getclient/' + $scope.response.clientId + '?token=' + $cookies.token, {
            }).
                    success(function (data, status, headers, config) {

                        console.log(data.Data[0]);
                        $scope.response.client = data.Data[0];
                        $scope.session.RegistrantFirstName = $scope.response.client.fname;
                        $scope.session.RegistrantLastName = $scope.response.client.lname;
                        $scope.session.RegistrantOrganizationName = $scope.response.client.company;
                        $scope.session.RegistrantAddress1 = $scope.response.client.address1;
                        $scope.session.RegistrantCity = $scope.response.client.address2;
                        $scope.session.RegistrantStateProvince = $scope.response.client.state;
                        $scope.session.RegistrantPostalCode = $scope.response.client.zipcode;
                        $scope.session.RegistrantCountry = $scope.response.client.name;
                        $scope.session.RegistrantEmailAddress = $scope.response.client.emailId;
                        $scope.session.RegistrantPhone = "91." + $scope.response.client.mobile;
                    });



            $scope.submit = function () {
                $scope.loading = true;

                $scope.response.err = 0;

                $http.post('/admin/api/register-domain', {
                    token: $cookies.token, //send token in every request
                    data: $scope.session,
                    duration: $scope.response.duration,
                    domainName: $scope.response.domainName
                }).
                        success(function (data, status, headers, config) {
                            //console.log(data);
                            // console.log(data.data.ApiResponse.Status);

                            if (data.data.ApiResponse.Status == "OK") {

                                $http.post('/admin/api/update-client-info', {
                                    token: $cookies.token, //send token in every request
                                    data: $scope.session,
                                    clientID: $scope.response.clientId
                                }).
                                        success(function (data) {

                                            alert("Registration Sucussful");

                                            window.location.href = "#/invoice.html?invoiceId=" + $scope.response.invoiceId;

                                        })


//                                alert("Registration Sucussful");
//
//                                window.location.href = "#/invoice.html?invoiceId=" + $scope.response.invoiceId;
                            } else {

                                $scope.response.err = data.data.ApiResponse.Errors.Error;
                                console.log($scope.response.err.length);
                                if (!$scope.response.err.length) {
                                    var data = [];
                                    data.push($scope.response.err);
                                    $scope.response.err = data;

                                }
                            }

                        }).finally(function () {
                    // Hide loading spinner whether our call succeeded or failed.
                    $scope.loading = false;
                });




                //----------------------------------------------------------------------------------

            }




        }




        //  $scope.master = {firstName:"John", lastName:"Doe"};
        // $scope.reset = function() {
        //     $scope.user = angular.copy($scope.master);
        // };
        // $scope.reset();
    }]);
