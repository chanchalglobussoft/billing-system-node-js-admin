'use strict';
/* Setup general page controller */
BillingApp.controller('PaymentController', ['$rootScope', '$scope', 'settings', '$http', 'mySharedService', '$window','$location',function($rootScope, $scope, settings, $http, sharedService, $window,$location) {
	$scope.$on('$viewContentLoaded', function() {
		Billing.initAjax();

			
		$scope.card = {};
		$scope.credit = 5;
		$scope.loadthis = true;

		// $scope.init = function(){
			$http.post('/admin/api/country/get-all-data', {
					token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3siYWRtaW5JZCI6IjExIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJmbmFtZSI6IlN5ZWQiLCJsbmFtZSI6IkFyc2hhZCIsIm1vYmlsZSI6Ijg4MTg4OTY2NjgiLCJlbWFpbElkIjoic3llZGFyc2hhZEBnbG9idXNzb2Z0LmNvbSIsInNreXBlSWQiOiJzeWVkYXJzaGFkX2dsb2J1c3NvZnQiLCJmYklkIjoiIiwic3VwcG9ydFRpY2tldFNpZ25hdHVyZSI6bnVsbCwiY3JlYXRlZE9uIjoiMjAxNS0wOC0zMSAxMToyOToxOSIsImxhc3RNb2RpZmllZE9uIjoiMjAxNS0wOC0zMSAxMToyOToxOSJ9XQ.4HwFgbB84PV0hPDgbHb9At6RqP3A8VSli7hxycNXIqk'
							}).success(function (data) {
					console.log(data);
					$scope.countries = data.Data;
			}).error(function (data) {
					console.log("Error in /country/get-all-data: " + data);
			});
		// }


		$scope.savecard = function() {
			$scope.loadthis = false;
			$scope.card.type = $scope.card.type.toLowerCase();
			console.log($scope.card);
			$http.post("/payment/savecard", $scope.card)
				.success(function(data) {
					$scope.loadthis = true;
					$http.post('/authapi/regen')
						.success(function(datab) {
							if(datab.status==200)
{
							var token = datab.data;
							$window.localStorage.setItem('token', token);
								$location.path('/welcome');
}
else{
	alert(error);
}


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


if ($rootScope.user.paymentverified == 1)

			{
				$location.path('/welcome');
			}
	});
}]);
