'use strict';
/* Setup general page controller */
BillingApp.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', function($rootScope, $scope, settings, $http, sharedService) {
		$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();

		$scope.resendmail = function() {
			$http.post("/authapi/resend")
				.success(function(data) {
					$scope.resend="Mail Sent";
					$scope.mailsent=true;
					//console.log(data);
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
					if(response.emailverified == 1)
					{
						$scope.resend="DONE";
						$scope.verifyemail=true;
					}
					else
					{
						$scope.resend="RESEND";
						$scope.verifyemail=false;
					}


      });
			}
		}

		if($rootScope.user)
		{
			console.log($rootScope.user.emailverified);

			if($rootScope.user.emailverified == 1)
					{
						$scope.resend="DONE";
						$scope.verifyemail=true;
					}
					else
					{
						$scope.resend="RESEND";
						$scope.verifyemail=false;
					}
					$scope.payment = true;
		}

	});
}]);
