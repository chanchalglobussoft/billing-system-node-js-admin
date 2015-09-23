MetronicApp.controller('ClientsignupController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function($rootScope, $scope, $http, $cookies, settings, $location) {

    $scope.response = {};

    $scope.init = function() {

        var affiliateId = $location.$$search.reff;
        if (affiliateId) {
           //   alert(affiliateId)

            $http.post('/check-affiliate', {

                token: $cookies.token,
                affiliate_id: affiliateId,




            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if (data.Data.length == 1) {


                    $cookies['affiliateId'] = data.Data[0].client_id;
                   // alert( data.Data[0].client_id)

                    $http.post('/client-hits', {

                        token: $cookies.token,
                        affiliate_id: $cookies['affiliateId'],
                        date_of_referral: moment().format("YYYY-MM-DD HH:mm:ss")




                    }).
                    success(function(data, status, headers, config) {
                        console.log(data);
                        if (data.code == 200) {
                            $cookies['affiliate_referrals_id'] = data.Data.insertId;



                        }
                    }).
                    error(function(data, status, headers, config) {});

                }
            }).
            error(function(data, status, headers, config) {});




        }

        //    $cookies['token'] = data.token;

        $scope.submit = function() {




            console.log($scope.session);

            $http.post('/addclient', {
                data: $scope.session,
                token: $cookies.token,
                date: moment().format('YYYY-MM-DD'),
                source: "SignUp By Client"




            }).
            success(function(data, status, headers, config) {
                console.log(data);
                if (data.code == 200) {
                    //alert(data.Data.insertId);

                        $http.post('/add-client-wallet', {

                                   token: $cookies.token,
                                   clientId: data.clientId

                        }).
                    success(function(data,status){
                        console.log(data);



                    })


                    //alert("Registration Sucessful");
                    signUpSuccess();
                    $scope.session ="";

                    if ($cookies.affiliate_referrals_id) {


                        $http.post('/update-referral', {
                            data: $cookies.affiliate_referrals_id,
                            clientId: data.Data.insertId,
                            token: $cookies.token,
                            date: moment().format("YYYY-MM-DD HH:mm:ss"),




                        }).
                        success(function(data, status) {

                            console.log(data);


                        })




                    }



                } else {
                    //alert("Registration Failed")
                    signUpFailed();
                }
            }).
            error(function(data, status, headers, config) {});


            //console.log($scope.session);

        }
    }



}]);
