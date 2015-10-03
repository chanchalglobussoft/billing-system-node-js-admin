'use strict';
/* Setup general page controller */
BillingApp.controller('PaymentController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', '$window', function($rootScope, $scope, settings, $http, sharedService, $window) {
	$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();
		$scope.card = {};
		$scope.credit = 5;
		$scope.loadthis = true;
		$scope.savecard = function() {
			$scope.loadthis = false;
			$scope.card.type = $scope.card.type.toLowerCase();
			console.log($scope.card);
			$http.post("/payment/savecard", $scope.card)
				.success(function(data) {
					$scope.loadthis = true;
					$http.post('/authapi/regen')
						.success(function(datab) {


							var token = datab.data;
							$window.localStorage.setItem('token', token);



						})
					console.log(data);
				})
		}

		$scope.getlink = function() {
			$scope.loadthis = false;
			var value = {};
			value.credit = $scope.credit;
			console.log(value);

			$http.post("/payment/getlink", value)
				.success(function(data) {
					if (data.status == 200) {
						$window.location.href = data.link;
						$scope.loadthis = true;
					} else {
						$scope.loadthis = true;
					}
					console.log(data);
				})
		}



	});
}]);