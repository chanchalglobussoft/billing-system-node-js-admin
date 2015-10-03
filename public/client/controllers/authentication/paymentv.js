'use strict';
/* Setup general page controller */
BillingApp.controller('paymentvController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', '$window', '$location', function($rootScope, $scope, settings, $http, sharedService, $window, $location) {
	$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();
		var dataa = {};
		dataa.paymentId = $location.$$search.paymentId;
		dataa.PayerID = $location.$$search.PayerID;
		$http.post("/payment/test", dataa)
			.success(function(data) {
				console.log(data);
				console.log(data.status);
				if (data.status == 200) {
					$http.post('/authapi/regen')
						.success(function(datab) {
							

							var token = datab.data;
							$window.localStorage.setItem('token', token);
							$location.search('paymentId', null);
							$location.search('token', null);
						    $location.search('PayerID', null);
							$location.path("/payment");



						})
						.error(function() {

						});
				} else {
					$scope.error = datab.message;
				}
			})



	});
}]);