/* Setup general page controller */
MetronicApp.controller('GeneralPageController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {
    $scope.response = {};




    $scope.init=function(){





      //alert("hi");
      $http.post('/admin/api/get-registered-domains', {//get all domains registered


              token: $cookies.token
          }).
          success(function(data, status, headers, config){
            if(data.data.ApiResponse.Status=="OK"){
            $scope.response.data=data.data.ApiResponse.CommandResponse.DomainGetListResult.Domain;
              console.log(data.data.ApiResponse.CommandResponse.DomainGetListResult.Domain.length);

              $timeout(function() {

                 //$("#example_paginate").hide();
                 var rowCount = $("#sample_1 tr").length;
                 console.log("Row count value is"+rowCount);
                 if (rowCount >= 0) {
                    console.log("Entered into Sorting");
                    TableAdvanced.init();
                 }
              }, 200)

    }

    });







    }









}]);
