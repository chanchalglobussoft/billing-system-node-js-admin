'use strict';
/* Setup general page controller */
BillingApp.controller('PaymentController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', function($rootScope, $scope, settings, $http, sharedService) {
	$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();
$scope.card={};
		$scope.savecard = function() {

			console.log($scope.card);
			$http.post("/payment/savecard",$scope.card)
				.success(function(data) {
					console.log(data);
				})
		}
		
		

	

	});
}]);