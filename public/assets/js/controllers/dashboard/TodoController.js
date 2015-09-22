'use strict';

BillingApp.controller('TodoController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() { 
    console.log($rootScope.user.username); 
     $scope.username=$rootScope.user.username;
        Billing.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
    $rootScope.settings.layout.pageSidebarClosed = true;
});