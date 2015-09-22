'use strict';
BillingApp.controller('authController', ['$scope', '$window', '$location', '$http','$timeout', function($scope, $window, $location, $http,$timeout) {

	$scope.pageClass = 'page-signup';

	$scope.user = {};
	if (window.user) {
		$location.path('/').replace();
	}

	$scope.register = function() {
		console.log($scope.users);

	}
	$scope.loginUser = function() {
		console.log($scope.user);
		$http.post('/auth/signin', $scope.user

			).success(function(data) {
				if (data.code == 200) {
					console.log(data.link);
					$location.path(data.link);
				} else if (data.code == 198) {
					$scope.error = data.message;
				} else {

				}


			})
			.error(function(data) {
$scope.error = data;
			});
	}
	$scope.signupUser = function() {
		console.log($scope.users);
		if ($scope.users.password == $scope.users.password2) {
			$http.post('/auth/signup', $scope.users

				).success(function(data) {
					if (data.code == 200) {
						$scope.error1 = "";
						$scope.success1 = "success! please login"

						$timeout(function() {
							$window.location.reload();
						}, 2000);

					} else if (data.code == 400) {
						$scope.error1 = data.message;
					} else {

					}


				})
				.error(function(data) {
					$scope.success1 = ""
					$scope.error1 = data;

				});


		} else {

			$scope.error1 = "password missmatch";

		}
	}


}]);