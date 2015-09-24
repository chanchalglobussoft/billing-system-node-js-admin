MetronicApp.controller('AffiliatesSettingsController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function($rootScope, $scope, $http, $cookies, settings) {

    $scope.response = {};

    $scope.session = {};
    $scope.latestaffsetting = function() {


        $http.post('/admin/api/affiliate-latest-settings', {

            token: $cookies.token,

        }).
        success(function(data, status, headers, config) {

            $scope.response.affdata = data.Data;
            console.log(data.Data);


        }).
        error(function(data, status, headers, config) {



        });

    }


    $scope.init = function() {

        $scope.latestaffsetting();




        $scope.check = function() {
            if ($scope.session.ctype == 1) {
                $scope.response.disable = true;
                $scope.session.percentage = 0;
            } else {

                $scope.response.disable = false;
            }

        }

        $scope.submit = function() {


            if ($scope.session.ctype) {

                // console.log($cookies.adminId);

                $http.post('/admin/api/affiliate-common-settings', {

                    token: $cookies.token,
                    adminId: $cookies.adminId,
                    data: $scope.session
                }).
                success(function(data, status, headers, config) {

                    $scope.latestaffsetting();
                    console.log(data);


                }).
                error(function(data, status, headers, config) {



                });




            } else {
                alert("Commission Type Is Not Checked")
            }


            console.log($scope.session);
        }




        $http.post('/admin/api/affiliate-request', {

            token: $cookies.token
        }).
        success(function(data, status, headers, config) {
            $scope.response.aff = data.Data;

            // console.log(data);


        }).
        error(function(data, status, headers, config) {



        });



    }

}]);

//Affiliate-profile



MetronicApp.controller('AffiliateProfileController', ['$rootScope', '$location', '$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope, $location, $timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};

    $scope.session = {};
    $scope.myFormdata = {};
    $scope.response.clientId = $location.$$search.clientId;

    $scope.init = function() {
            //calling some dependen functions
            $scope.currentaffset();
            $scope.afftraffic();
            $scope.affsummery();
            //--------------------------------------------------------

            //---------------------------------freeze Account Starts Here----------------------------
            //here data will be 0 or 1 ;0=Freeze;1=activate

            $scope.freeze = function(data) {



                    $http.post('/admin/api/freeze-account', {

                        status: data,
                        token: $cookies.token,
                        clientId: $scope.response.clientId
                    }).
                    success(function(data, status, headers, config) {
                        $scope.currentaffset();

                    })



                }
                //---------------------------------freeze Acoun Ends  Here----------------------------



            //----------------------------------------Relaease Amount Starts Here---------------------------
            //Admin can release Max 100% amount from available commission
            $scope.releaseAmount = function() {


                    var amount = ($scope.response.aff.available_mature_balance * $scope.myFormdata.per) / 100; //Callculating total amount to be transfered

                    console.log(amount);

                    if (amount <= $scope.response.aff.available_commission_balance) {} else {
                        alert("Wrong Attempt");
                    }




                    $http.post('/admin/api/transfer-commission', {

                        amount: amount,
                        adminId: $cookies.adminId,
                        token: $cookies.token,
                        clientId: $scope.response.clientId
                    }).
                    success(function(data, status, headers, config) {
                        console.log(data);
                        alert('Amount Sucessfully transferred To Client Wallet')
                        $scope.currentaffset(); //Calling Function To Update Balance



                    })




                }
                //----------------------------------------Relaease Amount Ends Here---------------------------




            //---------------------------Checking Commission Type------------------
            $scope.check = function() {
                    if ($scope.session.ctype == 1) {
                        $scope.response.disable = true;
                        $scope.session.percentage = 0;
                    } else {

                        $scope.response.disable = false;
                    }

                }
                //---------------------------------------------------------------------------



            //---------------------------------------Submit Function Starts Here-----------
            $scope.submit = function() {


                if ($scope.session.ctype) {

                    // console.log($cookies.adminId);

                    $http.post('/admin/api/affiliate-advanced-settings', {

                        token: $cookies.token,
                        adminId: $cookies.adminId,
                        dateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        data: $scope.session,
                        client_id: $scope.response.clientId
                    }).
                    success(function(data, status, headers, config) {

                        //$scope.latestaffsetting();
                        //console.log(data);
                        $scope.currentaffset();



                    }).
                    error(function(data, status, headers, config) {



                    });




                } else {
                    alert("Commission Type Is Not Checked")
                }


                // console.log($scope.session);
            }




        }
        //------------------------------------Submit Ends Here--------------------------------------



    //------------------------------------------------------------------------------------------------
    $scope.currentaffset = function() {



            $http.post('/admin/api/affiliate-current-settings', {

                token: $cookies.token,
                clientId: $scope.response.clientId
            }).
            success(function(data, status, headers, config) {
                $scope.response.aff = data.Data[0];

                console.log($scope.response.aff);

                if ($scope.response.aff.status == 0) {

                    $scope.response.activate = true;
                    $scope.response.inactive = false;

                } else if ($scope.response.aff.status == 1) {
                    $scope.response.inactive = true;
                    $scope.response.activate = false;

                }

            }).
            error(function(data, status, headers, config) {



            });
        }
        //---------------------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------------
    $scope.afftraffic = function() {

            $http.post('/admin/api/affiliates-traffic-id', {
                token: $cookies.token,
                clientId: $scope.response.clientId
            }).
            success(function(data) {
                $scope.response.data = data.Data;
                // console.log(data.Data);


            })
            $scope.timeout();



        }
        //-------------------------------------------------------------------------------------------------
        //---------------------------------------aff summery--------------------------------

    $scope.affsummery = function() {

            $http.post('/admin/api/affiliates-summery', {
                token: $cookies.token,
                clientId: $scope.response.clientId
            }).
            success(function(data) {
                $scope.response.summery = data.Data[0];
                // console.log(data.Data);


            })



        }
        //--------------------------------------------------------------------------------------------


    //----------------------------TimeOut-----------------------------------
    $scope.timeout = function() {
            $timeout(function() {

                //$("#example_paginate").hide();
                var rowCount = $("#sample_1 tr").length;
                console.log("Row count value is" + rowCount);
                if (rowCount >= 0) {
                    console.log("Entered into Sorting");
                    TableAdvanced.init();
                }
            }, 200);
        }
        //-


}]);




MetronicApp.controller('AffiliateInfoController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope, $timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};


    $scope.timeout = function() {
        $timeout(function() {

            //$("#example_paginate").hide();
            var rowCount = $("#sample_1 tr").length;
            console.log("Row count value is" + rowCount);
            if (rowCount >= 0) {
                console.log("Entered into Sorting");
                TableAdvanced.init();
            }
        }, 200);
    }


    $scope.init = function() {
        $http.post('/admin/api/affiliate-request', {

            token: $cookies.token
        }).
        success(function(data, status, headers, config) {
            $scope.response.aff = data.Data;
            $scope.timeout();
            // console.log(data);


        }).
        error(function(data, status, headers, config) {



        });


    }



}]);




MetronicApp.controller('PromocodeSettingsController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope, $timeout, $scope, $http, $cookies, settings) {


    $scope.response = {};
    $scope.session = {};
    $scope.count = 1;

    $scope.code = function() {

        var code = "PUH#"


        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        $scope.session.code = code;



    }

    $scope.submit = function() {

        console.log($scope.session)


        $http.post('/admin/api/insert-promocode', {

            token: $cookies.token,
            startdate: "2014-10-10 10:05:30",
            enddate: "2016-10-10 10:05:30",
            code: $scope.session.code,
            status: 1,
            type: 2,
            value: 40,
            clientId: 11
        }).
        success(function(data, status, headers, config) {
        if(data.code==200){
            alert("Promocode Is Generated And Active Now")

            // console.log(data);
            $scope.getpromocodes();
        }


        })


    }

    $scope.getpromocodes = function() {

        $http.post('/admin/api/promocodes-report', {

            token: $cookies.token,

        }).
        success(function(data, status, headers, config) {

if(data.code==200){
            $scope.response.promocodedata = data.Data;
            console.log(data.Data);

            if ($scope.count == 1) {
                $timeout(function() {

                    //$("#example_paginate").hide();
                    var rowCount = $("#sample_1 tr").length;
                    console.log("Row count value is" + rowCount);
                    if (rowCount >= 0) {
                        console.log("Entered into Sorting");
                        TableAdvanced.init();
                    }
                }, 200);
            }

            $scope.count++

}
        })




    }


    $scope.remove=function(data){
// alert(data);
 $http.post('/admin/api/delete-promocode', {

            token: $cookies.token,
            promocode_id:data

        }).
        success(function(data, status, headers, config) {
if(data.code==200){   $scope.getpromocodes(); }


        });




    }


    $scope.getpromocode=function(data){

         $http.post('/admin/api/get-promocode', {

            token: $cookies.token,
            promocode_id:data

        }).
        success(function(data, status, headers, config) {

            $scope.response.edit=data.Data[0];

        console.log($scope.response.edit);

        });


    }



$scope.updatepromocode=function(){



         $http.post('/admin/api/update-promocode', {

            token: $cookies.token,
            data:$scope.response.edit

        }).
        success(function(data, status, headers, config) {

         if(data.code==200){   $scope.getpromocodes(); }

        });


// console.log($scope.response.edit);
}



}]);
