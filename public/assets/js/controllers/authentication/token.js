'use strict';
/* Setup general page controller */
BillingApp.controller('tokenController', ['$rootScope', '$scope','$stateParams','$window','$location',function($rootScope, $scope,$stateParams,$window,$location) {

console.log($stateParams);
var token=$stateParams.code;
$window.localStorage.setItem('token', token);
$location.path("/welcome");


}]);
