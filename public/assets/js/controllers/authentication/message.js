/* Setup general page controller */
BillingApp.controller('messageController', ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$http', function($rootScope, $scope, $stateParams, $window, $location, $http) {

	console.log($stateParams.no);
	console.log("asdkjgahskjdhkasjhdjkhjks");

	$scope.message = "null";
	switch ($stateParams.no) {
		case "1":
			$scope.message = "hello";
			break;
		case "2":
			$scope.message = "your email is confirmed";
			break;
		case "3":
			$scope.message = "the link has been expired";
			break;
		default:
			$scope.message = "default";
			break;


	}


}]);