BillingApp.controller('forgotController', ['$scope', '$routeParams', '$location', '$http', '$animate','$timeout', 'Global', function($scope, $routeParams, $location, $http, $animate,$timeout, Global) {
	$scope.global = Global;
	$scope.pageClass = 'page-signup';

	$scope.user = {};
	if (window.user) {
		$location.path('/').replace();
	}
	$scope.forgot = function() {
		console.log($scope.user);
		$http.post('/auth/forgotpassword', $scope.user, function() {

				}

			).success(function(data) {
				if (data.code == 200) {
					$scope.error = "";
					$scope.success = data.message;
					$scope.hide="1";
					$timeout(function() {
						$location.path('/').replace();						
					}, 5000);

				} else {
					var element = document.getElementById('input')
					$animate.addClass(element, 'shake').then(function() {
						$animate.removeClass(element, 'shake');
					});
					$scope.error = data.message;
				}


			})
			.error(function() {

			});
	}


}]);