'use strict';

MetronicApp.controller('UserProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});




MetronicApp.controller('InvoiceController', function($rootScope, $scope, $http, $timeout, $location,$cookies) {
//console.log( $location.$$search.userId);
$scope.response={};
$scope.init=function(){

  var invoiceId=$location.$$search.invoiceId;
              $http.post('/admin/api/invoicedetails', {invoiceId: invoiceId, token: $cookies.token}).
                      success(function(data, status, headers, config) {
                          if (data.code == 200) {
                            var a=10;
                            $scope.response.stax=a;

                            $scope.response.invoiceDetails=data.Data[0];

                            $scope.response.totalPrice=  parseInt(data.Data[0].amount)+parseInt((data.Data[0].amount/100)*a);


                             console.log($scope.response.totalPrice);
                          } else {
                              alert("Registration Failed")
                          }
                          //console.log(data.code);
                          // console.log("hello");
                          // this callback will be called asynchronously
                          // when the response is available
                      }).
                      error(function(data, status, headers, config) {

                      });



}


  });
