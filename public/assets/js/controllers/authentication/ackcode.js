/* Setup general page controller */
BillingApp.controller('ackcodeController', ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$http', function($rootScope, $scope, $stateParams, $window, $location, $http) {

			console.log($stateParams.ackcode);
			console.log("asdkjgahskjdhkasjhdjkhjks");


			$http.post('/authapi/ack', $stateParams)
				.success(function(data) {
						if (data.status == 200) {
							if($window.localStorage.getItem('token'))
							{
							$http.post('/authapi/regen', $stateParams)
								.success(function(data) {
										if (data.status == 200) {
											token = data.data;
											$window.localStorage.setItem('token', token);
											$location.path("/welcome");
											} else {
												$scope.error = data.message;
											}


										})
									.error(function() {

									});
								}
								else
								{
								$location.path("/message/2");	
								}

								} else {
									$scope.error = data.message;
									$location.path("/message/3");
								}


						})
					.error(function() {

					});



				}]);