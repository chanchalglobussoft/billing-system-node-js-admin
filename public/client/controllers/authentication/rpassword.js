/* Setup general page controller */
BillingApp.controller('rpasswordController', ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$http', '$timeout', function($rootScope, $scope, $stateParams, $window, $location, $http, $timeout) {


	$http.post('/authapi/rcheck', $stateParams)
		.success(function(data) {
			if (data.status == 200) {


			} else {
				$scope.error = data.message;
				$location.path("/message/4");
			}


		})
		.error(function() {

		});


	$scope.save = function() {
		console.log($scope.user);
		if ($scope.user.password == $scope.user.password2) {
			$scope.user.rcode = $stateParams.rcode;
			$http.post('/authapi/newpassword', $scope.user

				).success(function(data) {
					if (data.status == 200) {
						$scope.error = "";
						$scope.message = "success! please login"

						$timeout(function() {
							$location.path("/");
						}, 2000);



					} else if (data.status == 198) {
						$scope.error = data.message;
					} else {

					}


				})
				.error(function() {
					$scope.error = "password mismatch";
				});
		} else {
			$scope.error = "password mismatch";
		}
	}



}]);