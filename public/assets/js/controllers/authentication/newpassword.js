BillingAp.controller('newpasswordController', ['$scope', '$routeParams', '$location', '$http', '$animate', '$timeout', 'Global', function($scope, $routeParams, $location, $http, $animate, $timeout, Global) {
	$scope.global = Global;
	if (window.user) {
		$location.path('/').replace();
	}
	console.log($routeParams.hash);
	console.log($scope.user);

	//to check whether the link is valid
	$http.post('/auth/newpasswordcheck', $routeParams, function() {}).success(function(data) {
			if (data.code != 200) {
				$location.path('/').replace();
			}
		})
		.error(function() {});

	//to resetpassword
	$scope.forgot = function() {
		console.log($scope.user);
		if ($scope.user.password == $scope.user.repassword) {
			$scope.error = ""
			$scope.user.hash=$routeParams.hash;
			$http.post('/auth/newpassword', $scope.user, function() {}
				).success(function(data) {
					if (data.code == 200) {
						// $scope.error = "";
						// $scope.success = data.message;
						// $scope.hide = "1";
						// $timeout(function() {
						// 	$location.path('/').replace();
						// }, 5000);
					} else {
						// var element = document.getElementById('input')
						// $animate.addClass(element, 'shake').then(function() {
						// 	$animate.removeClass(element, 'shake');
						// });
						// $scope.error = data.message;
					}


				})
				.error(function() {

				});
		} else {
			$scope.error = "password mismatch"

		}
	}



}]);