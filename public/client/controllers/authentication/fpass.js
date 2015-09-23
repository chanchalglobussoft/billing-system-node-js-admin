'use strict';
/* Setup general page controller */
BillingApp.controller('fpasswordController', [ '$scope', 'settings', '$http', 'mySharedService','$timeout','$location', function($scope, settings, $http,sharedService,$timeout,$location) {
	// $scope.$on('$viewContentLoaded', function() {
	// 	Billing.initAjax();


		$scope.forgot = function() {
			console.log($scope.email);
			$http.post('/authapi/fpassword', $scope.user).success(function(data) {
					if (data.status == 200) {
						$scope.error = "";
						$scope.message = data.message;
						$scope.hide = "1";
						$timeout(function() {
							$location.path('/').replace();
						}, 5000);

					} else {

						$scope.error = data.message;
					}


				})
				.error(function() {

				});
		}

	// });
}]);