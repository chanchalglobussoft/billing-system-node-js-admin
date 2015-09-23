'use strict';
/* Setup general page controller */
BillingApp.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', function($rootScope, $scope, settings, $http, sharedService) {
	$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();
		$scope.resend = function() {
			$http.post("/authapi/resend")
				.success(function(data) {
					console.log(data);
				})
		}
		
		if (window.addEventListener) {
			// Normal browsers
			window.addEventListener("storage", handler, false);
		} else {
			// for IE (why make your life more difficult)
			window.attachEvent("onstorage", handler);
		}

		function handler(e) {
			if(localStorage.getItem('token'))
			{
				$http.get('/authapi/me').success(function(response) {
					$scope.verifyemail=1-response.emailverified;

      });
			}
		}

		if($rootScope.user)
		{
			console.log($rootScope.user.emailverified);
		
		$scope.verifyemail = 1-$rootScope.user.emailverified;
		$scope.payment = true;
		}

	});
}]);